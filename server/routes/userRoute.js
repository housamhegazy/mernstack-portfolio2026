const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  upload,
  cloudinary,
  bufferToDataUri,
} = require("../utils/cloudinary.js");
const User = require("../models/UserModel.js");
const { AuthMiddleware } = require("../middleware/AuthmiddleWare.js");

function setAuthCookie(res, token) {
  // إعداد الكوكيز مع الخيارات المناسبة
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 أسبوع
  });
}

router.post("/login", async (req, res) => {
  // Handle user login
  try {
    const { email, password } = req.body;
    // البحث عن المستخدم في قاعدة البيانات
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // تحقق من صحة كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // إنشاء وتوقيع JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    setAuthCookie(res, token);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", AuthMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/signout", AuthMiddleware, async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

router.put(
  "/updateprofile",
  AuthMiddleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cvFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, email, bio, age, college, university } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      let avatarUrl = user.avatar;
      let cvUrl = user.cv;
      if (req.files && req.files.avatar) {
        if (user.avatar && !user.avatar.includes("default")) {
          const publicId = user.avatar
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader
            .destroy(publicId)
            .catch(() => console.log("Delete old avatar failed"));
        }
        const avatarFile = req.files.avatar[0];
        const fileUri = bufferToDataUri(avatarFile.mimetype, avatarFile.buffer);
        const uploadResult = await cloudinary.uploader.upload(fileUri, {
          folder: "portfolio-avatars",
          resource_type: "auto",
        });
        avatarUrl = uploadResult.secure_url;
      }

    // --- معالجة ملف السي في (CV) ---
if (req.files && req.files.cvFile) {
  const cvFile = req.files.cvFile[0];
  const fileUri = bufferToDataUri(cvFile.mimetype, cvFile.buffer);

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: "portfolio-cvs",
    // ✅ هنستخدم 'image' بدل 'auto' لأن الكلاوديناري بيعامل الـ PDF كصورة مستند
    resource_type: "image", 
    format: "pdf", // نحدد التنسيق يدوي
    type: "upload", // التأكيد إن النوع رفع عادي مش محمي
    access_mode: "public", // متاح للكل
    // ✅ شيل الـ .pdf من الاسم عشان هو هيضيفه أوتوماتيك من الـ format
    public_id: `cv-${userId}-${Date.now()}`, 
    invalidate: true, // عشان يمسح أي كاش قديم للأيرور
  });

  cvUrl = result.secure_url;
}

      // 2. تحديث البيانات (تأكد من تمرير role: finalRole)
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,
          email,
          bio,
          age,
          college,
          university,
          cv: cvUrl,
          avatar: avatarUrl,
        },
        { new: true },
      );

      // لو مفيش تغيير في الـ Role، بنرجع البيانات عادي
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
);

// تحديث المهارات فقط
router.put("/update-skills", AuthMiddleware, async (req, res) => {
  try {
    const { skills } = req.body; // بنستقبل مصفوفة [ "React", "Node" ]
    const userId = req.user.id;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { professionalSkills: skills },
      { new: true },
    ).select("professionalSkills"); // نرجع المهارات بس

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update-sociallinks", AuthMiddleware, async (req, res) => {
  try {
    const { newsocialLinks } = req.body;
    const userId = req.user.id;
    if (!Array.isArray(newsocialLinks)) {
      return res.status(400).json({ message: "social links must be an array" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { socialLinks: newsocialLinks },
      { new: true, runValidators: true }, // runValidators عشان يتأكد من الـ Schema
    ).select("socialLinks"); // نرجع المهارات بس
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser.socialLinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/add-project", AuthMiddleware, upload.single("projectImage"), async (req, res) => {
  try {
    const userId = req.user.id;
    // الباك إند بيستقبل كائن المشروع الواحد في FormData تحت اسم "projectData"
    let { projectData } = req.body; 
    if (typeof projectData === "string") projectData = JSON.parse(projectData);

    let imageData = { url: "", public_id: "" };

    if (req.file) {
      const fileDataUri = bufferToDataUri(req.file.mimetype, req.file.buffer);
      const uploadResponse = await cloudinary.uploader.upload(fileDataUri, {
        folder: "samsem_portfolio",
      });
      imageData = { url: uploadResponse.secure_url, public_id: uploadResponse.public_id };
    }

    // بناء كائن المشروع الجديد
    const newProject = { 
      ...projectData, 
      image: imageData 
    };

    // إضافة المشروع الجديد للمصفوفة باستخدام $push
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { projects: newProject } },
      { new: true, runValidators: true }
    ).select("projects");

    res.status(201).json(updatedUser.projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// روت الحذف
router.delete("/delete-project/:projectId", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    // 1. نجيب المستخدم والمشروع عشان نوصل للـ public_id بتاع الصورة
    const user = await User.findById(userId);
    const project = user.projects.id(projectId); // البحث عن المشروع الفرعي بواسطة الـ ID

    if (!project) {
      return res.status(404).json({ message: "Project not found, Samsem!" });
    }

    // 2. حذف الصورة من كلاوديناري لو موجودة
    if (project.image && project.image.public_id) {
      await cloudinary.uploader.destroy(project.image.public_id);
    }

    // 3. حذف المشروع من مصفوفة المستخدم في المونجو
    user.projects.pull(projectId); 
    await user.save();

    res.json({ message: "Project deleted successfully", projects: user.projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/edit-project/:projectId", AuthMiddleware, upload.single("projectImage"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    
    // تحويل البيانات النصية من FormData
    let { updatedData } = req.body;
    if (typeof updatedData === "string") updatedData = JSON.parse(updatedData);

    const user = await User.findById(userId);
    const project = user.projects.id(projectId); // الوصول للمشروع داخل المصفوفة

    if (!project) return res.status(404).json({ message: "Project not found, Samsem!" });

    // ⭐️ في حالة وجود صورة جديدة مرفوعة
    if (req.file) {
      // أ- حذف الصورة القديمة من كلاوديناري
      if (project.image && project.image.public_id) {
        await cloudinary.uploader.destroy(project.image.public_id);
      }

      // ب- رفع الصورة الجديدة (تحويل Buffer لـ Data URI)
      const fileDataUri = bufferToDataUri(req.file.mimetype, req.file.buffer);
      const uploadResponse = await cloudinary.uploader.upload(fileDataUri, {
        folder: "samsem_portfolio",
      });

      // ج- تحديث بيانات الصورة في المشروع
      project.image = {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id
      };
    }

    // تحديث باقي البيانات النصية (Title, Description, etc.)
    // بنستخدم Object.assign عشان نحدث الحقول اللي جت بس
    Object.assign(project, updatedData);

    await user.save(); // حفظ التغييرات في المونجو
    res.json({ message: "Project updated successfully", projects: user.projects });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/userdata", async (req, res) => {
  try {
    // استخدم findOne عشان نجيب أول مستخدم (اللي هو إنت) 
    // وبنعمل select("-password") عشان الباسورد ميبانش في الفرونت إند لأي حد
    const data = await User.findOne().select("-password -tokens -role");

    if (!data) {
      return res.status(404).json({ message: "User data not found, Samsem!" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
