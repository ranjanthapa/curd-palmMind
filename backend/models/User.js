const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name require"],
  },
  email: {
    type: String,
    required: [true, "Email should be set"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide an valid email"],
  },
  password: {
    type: String,
    required: [true, "Password should be set"],
    minLength: [8, "Weak password, minimum of 8 character is require"],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.isCorrectPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
