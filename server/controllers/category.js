const Category = require("../models/category");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, content } = req.body;
    const slug = slugify(name);
    const image = {
      url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
      key: "123",
    };

    const category = new Category({ name, slug, image });
    category.postedBy = req.user._id;

    const data = await category.save();
    res.json(data);
  } catch (err) {
    console.log("CATEGORY CREATE ERR", err);
    return res.status(400).json({
      error: "Category create failed",
    });
  }
};

exports.list = (req, res) => {
  //
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
