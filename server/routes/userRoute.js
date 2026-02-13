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
        const cvFile = req.files.cvFile[0]; // بناخد أول ملف في مصفوفة الـ cvFile
        const fileUri = bufferToDataUri(cvFile.mimetype, cvFile.buffer);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "portfolio-cvs",
          resource_type: "raw", // مهم جداً للملفات الـ PDF
          public_id: `cv-${userId}-${Date.now()}`,
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
      { new: true }
    ).select("professionalSkills"); // نرجع المهارات بس

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
