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
    }, 
    bio: String, 
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
      default: [],
    },
    projects: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          image: {
            url: { type: String, default: "" },
            public_id: { type: String, default: "" }, 
          },
          technologies: [String], 
          githubLink: String,
          liveLink: String, 
          category: { type: String, default: "Web Development" },
          startDate: Date,
          endDate: Date,
        },
      ],
      default: [],
    },

    professionalSkills: {
      type: [String], 
      default: [],
    },
  },
  {
    timestamps: true, 
  },
);

module.exports = mongoose.model("User", userSchema);
