const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  registerEmailParams,
  forgotPasswordEmailParams,
} = require("../helpers/email");
const shortId = require("shortid");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const Link = require("../models/link");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const { name, email, password, categories } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const token = jwt.sign(
      { name, email, password, categories },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );
    const emailParams = registerEmailParams(email, token);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailParams.subject,
      html: emailParams.html,
    };

    // Sending the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({
          message: "We could not send the email. Please try again.",
        });
      }
      console.log("Email sent: " + info.response);
      res.json({
        message: `Email has been sent to ${email}. Follow the instructions to complete your registration.`,
      });
    });
  } catch (error) {
    console.log("Error during registration:", error);
    res.json({
      message: "We could not verify your email. Please try again",
    });
  }
};

exports.registerActivate = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);

    const { name, email, password, categories } = decoded;
    const username = shortId.generate();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email is already taken",
      });
    }

    const newUser = new User({
      username,
      name,
      email,
      password,
      categories,
    });

    const savedUser = await newUser.save();

    return res.json({
      message: "Registration success. Please login.",
    });
  } catch (error) {
    console.error("Error during registration activation:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        error: "Expired or invalid link. Please try again.",
      });
    }

    return res.status(500).json({
      error: "Error during registration. Please try again later.",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please register.",
      });
    }

    const isMatch = await user.authenticate(password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, role } = user;

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
    const emailParams = forgotPasswordEmailParams(email, token);

    await user.updateOne({ resetPasswordLink: token });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailParams.subject,
      html: emailParams.html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({
          message:
            "We could not process your password reset. Please try again later.",
        });
      }
      console.log("Email sent: " + info.response);
      res.json({
        message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
      });
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

exports.canUpdateDeleteLink = async (req, res, next) => {
  try {
    const { id } = req.params;

    const link = await Link.findById(id);

    if (!link) {
      return res.status(400).json({
        error: "Link not found",
      });
    }

    const authorizedUser =
      link.postedBy._id.toString() === req.user._id.toString();

    if (!authorizedUser) {
      return res.status(403).json({
        error: "You are not authorized to perform this action",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while verifying authorization",
    });
  }
};
