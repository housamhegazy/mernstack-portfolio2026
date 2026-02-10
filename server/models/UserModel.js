const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: String, // عشان تقدر تغير صورتك من الداشبورد زي ما طلبت
    bio: String, // وصفك الشخصي اللي هيظهر في الـ Home Page
  },
  {
    timestamps: true, // لإضافة حقلي createdAt و updatedAt تلقائياً
  },
);

module.exports = mongoose.model("User", userSchema);
