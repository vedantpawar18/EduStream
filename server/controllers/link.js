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
