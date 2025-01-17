const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const crypto = require("crypto");


const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  return res.status(statusCode).json({
    status: "sucess",
    token,
    data: {
      user,
    },
  });
};

exports.SignUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const isuserExists = await User.findOne({ email });
    if (isuserExists) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email already in use" });
    }

    const newUser = await User.create(req.body);
    createSendToken(newUser, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "failed", message: "provide email, password" });
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.isCorrectPassword(password, user.password))) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid credintial" });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "No user found with the requested email" });
  }

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/reset-password.html?token=${resetToken}`;
  const message = `Forgot your password? Submit with your new password to: 
  ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (Valid for 10 min only)",
      message,
    });
    return res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    return res.status(400).json({
      message: "There was an error sending email, please try again later",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
     return res.status(400).json({message: "Invalid token or token expire"})
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.ListAllUser = async (req, res) => {
  try {
    const allUser = await User.find();
    return res
      .status(200)
      .json({ status: "success", length: allUser.length, data: allUser });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
