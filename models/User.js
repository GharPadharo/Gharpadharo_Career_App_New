import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "superadmin"],
        message: "{VALUE} is not a valid role",
      },
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Safe export pattern preventing OverwriteModelError during Next.js hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema);
