const Link = require("../models/link");
const User = require("../models/user");
const Category = require("../models/category");
const { linkPublishedParams } = require("../helpers/email");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.create = async (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  const slug = url;
  try {
    const newLink = new Link({
      title,
      url,
      categories,
      type,
      medium,
      slug,
      postedBy: req.user._id,
    });

    const savedLink = await newLink.save();
    res.json(savedLink);

    const users = await User.find({ categories: { $in: categories } }).exec();
    const categoryDetails = await Category.find({
      _id: { $in: categories },
    }).exec();

    savedLink.categories = categoryDetails;
    for (const user of users) {
      const params = linkPublishedParams(user.email, savedLink);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: params.subject,
        html: params.html,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", user.email, info.response);
      } catch (error) {
        console.error("Error sending email to", user.email, error);
      }
    }
  } catch (error) {
    console.error("Error creating link or sending emails:", error);
    return res.status(400).json({
      error: "Failed to create link or send notifications.",
    });
  }
};

exports.list = async (req, res) => {
  try {
    const limit = req.body.limit ? parseInt(req.body.limit) : 10;
    const skip = req.body.skip ? parseInt(req.body.skip) : 0;

    const links = await Link.find({})
      .populate("postedBy", "name")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json(links);
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: "Could not list links",
    });
  }
};

exports.read = async (req, res) => {
  const { id } = req.params;

  try {
    const link = await Link.findById(id);

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    return res.json(link);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error finding link" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, url, categories, type, medium } = req.body;
  const updatedLink = { title, url, categories, type, medium };

  try {
    const updated = await Link.findByIdAndUpdate(id, updatedLink, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Link not found" });
    }

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error updating the link" });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Link.findOneAndDelete(id);

    if (!data) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json({ message: "Link removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error removing the link" });
  }
};

exports.clickCount = async (req, res) => {
  const { linkId } = req.body;
  try {
    const result = await Link.findByIdAndUpdate(
      linkId,
      { $inc: { clicks: 1 } },
      { upsert: true, new: true }
    );
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: "Could not update view count",
    });
  }
};

exports.popular = async (req, res) => {
  try {
    const links = await Link.find()
      .populate("postedBy", "name")
      .sort({ clicks: -1 })
      .limit(3);

    res.json(links);
  } catch (err) {
    res.status(400).json({
      error: "Links not found",
    });
  }
};

exports.popularInCategory = async (req, res) => {
  const { slug } = req.params;

  try {
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    const links = await Link.find({ categories: category })
      .sort({ clicks: -1 })
      .limit(3);

    res.json(links);
  } catch (err) {
    res.status(400).json({
      error: "Could not load category or links",
    });
  }
};
