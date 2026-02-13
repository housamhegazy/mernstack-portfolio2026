const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/d_avatar.png/avatar.png",
    }, // عشان تقدر تغير صورتك من الداشبورد زي ما طلبت
    bio: String, // وصفك الشخصي اللي هيظهر في الـ Home Page
    age: Number,
    college: String,
    university: String,
    cv: String,
    socialLinks: {
      type: [
        {
          platform: String, // LinkedIn, GitHub, etc.
          url: String,
        },
      ],
      default: [], // القيمة الافتراضية تكون مصفوفة فاضية هنا
    },

    // ---------------- إضافة المشاريع هنا ----------------
    projects: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          image: {
            url: { type: String, default: "" },
            public_id: { type: String, default: "" }, // مهم جداً للحذف
          },
          technologies: [String], // مثال: ["React", "Node.js"]
          githubLink: String,
          liveLink: String, // رابط المعاينة المباشرة
          category: { type: String, default: "Web Development" },
          startDate: Date,
          endDate: Date,
        },
      ],
      default: [],
    },

    professionalSkills: {
      type: [String], // مصفوفة من الكلمات (مثل: React, Node, SQL)
      default: [],
    },
  },
  {
    timestamps: true, // لإضافة حقلي createdAt و updatedAt تلقائياً
  },
);

module.exports = mongoose.model("User", userSchema);
