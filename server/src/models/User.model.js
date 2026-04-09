import bcrypt from "bcrypt";
import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    specialization: { type: String, required: true },
    bio: { type: String, required: true },
    avatarUrl: { type: String, required: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "doctor", "receptionist"],
      index: true,
    },
    doctorProfile: { type: doctorProfileSchema, default: undefined },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("passwordHash")) return next();
  if (typeof this.passwordHash === "string" && this.passwordHash.startsWith("$2"))
    return next();

  try {
    const saltRounds = 10;
    this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Compare a plain text password to the stored password hash.
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.verifyPassword = async function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model("User", userSchema);

