import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationToken: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    resetToken: { type: String, default: null },
    resetTokenExpiration: { type: Date, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
