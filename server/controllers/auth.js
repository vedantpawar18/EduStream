const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  registerEmailParams,
  forgotPasswordEmailParams,
} = require("../helpers/email");
const shortId = require("shortid");
const expressJwt = require("express-jwt");
const _ = require("lodash");

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );
    const params = registerEmailParams(email, token);
    const sendEmailCommand = new SendEmailCommand(params);
    const data = await sesClient.send(sendEmailCommand);
    console.log("Email submitted to SES", data);
    res.json({
      message: `Email has been sent to ${email}, Follow the instructions to complete your registration`,
    });
  } catch (error) {
    console.log("Error during registration:", error);
    res.json({
      message: `We could not verify your email. Please try again`,
    });
  }
};

exports.registerActivate = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    const { name, email, password } = decoded;
    const username = shortId.generate();

    // Check if user already exists
    const user = await User.findOne({ email }).exec(); // Using await to handle promise
    if (user) {
      return res.status(401).json({
        error: "Email is taken",
      });
    }

    // Register new user
    const newUser = new User({ username, name, email, password });
    await newUser.save(); // Using await to handle promise
    return res.json({
      message: "Registration success. Please login.",
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      error:
        "Error with the activation link or saving user in database. Try later",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }).exec(); // Use await for the async query
    if (!user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please register.",
      });
    }

    // Authenticate user (check password)
    const isMatch = await user.authenticate(password); // Ensure authenticate is async
    if (!isMatch) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }

    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, role } = user;

    // Send response with token and user data
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET });

exports.authMiddleware = async (req, res, next) => {
  try {
    const authUserId = req.user._id;
    const user = await User.findById(authUserId);

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
    });
  }
};

// Admin Middleware
exports.adminMiddleware = async (req, res, next) => {
  try {
    const adminUserId = req.user._id;
    const user = await User.findById(adminUserId);
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({
        error: "User with that email does not exist",
      });
    }
    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" }
    );
    const params = forgotPasswordEmailParams(email, token);
    await user.updateOne({ resetPasswordLink: token });
    const sendEmailCommand = new SendEmailCommand(params);
    const data = await sesClient.send(sendEmailCommand);
    console.log("Email submitted to SES", data);
    res.json({
      message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
    });
  } catch (error) {
    console.log("Error during password reset:", error);
    res.status(500).json({
      message:
        "We could not process your password reset. Please try again later.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (!resetPasswordLink || !newPassword) {
    return res
      .status(400)
      .json({ error: "Reset link or new password is missing." });
  }

  try {
    const decoded = await jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD
    );

    const user = await User.findOne({ resetPasswordLink }).exec();

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired token. Try again." });
    }
    user.password = newPassword;
    user.resetPasswordLink = "";

    await user.save();
    return res.json({
      message: "Great! Now you can login with your new password.",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Password reset failed. Try again." });
  }
};
