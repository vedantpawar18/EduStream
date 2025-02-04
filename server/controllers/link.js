const Link = require("../models/link");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log("called");
    const { title, url, categories, type, medium } = req.body;
    const existingLink = await Link.findOne({ url });
    if (existingLink) {
      return res.status(400).json({ error: "Link already exists" });
    }
    const slug = url;

    const newLink = new Link({
      title,
      url,
      categories: categories,
      type,
      medium,
      slug,
      postedBy: req.user._id,
    });

    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (err) {
    console.error("Error creating link:", err);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};

exports.list = async (req, res) => {
  try {
    const links = await Link.find().exec();

    if (!links || links.length === 0) {
      return res.status(404).json({ error: "No links found" });
    }

    res.status(200).json(links);
  } catch (err) {
    console.error("Error fetching links:", err);
    res
      .status(500)
      .json({ error: "Could not list links, please try again later" });
  }
};

exports.read = (req, res) => {
  //
};

exports.update = (req, res) => {
  //
};

exports.remove = (req, res) => {
  //
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
