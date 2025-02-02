const Category = require("../models/category");
const Link = require("../models/link");
const slugify = require("slugify");
const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

exports.create = async (req, res) => {
  const { name, image, content } = req.body;

  if (!name || !image || !content) {
    return res
      .status(400)
      .json({ error: "Name, image, and content are required" });
  }
  const base64Data = Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = image.split(";")[0].split("/")[1];

  const slug = slugify(name);
  let category = new Category({ name, content, slug });

  const imageSize = base64Data.length;
  if (imageSize > 2000000) {
    return res.status(400).json({ error: "Image should be less than 2MB" });
  }

  const imageKey = `category/${uuidv4()}.${type}`;

  const params = {
    Bucket: "myextendedbucket",
    Key: imageKey,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("AWS Upload Response:", data);

    category.image = {
      url: `https://myextendedbucket.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${imageKey}`,
      key: imageKey,
    };
    category.postedBy = req.user._id;

    const savedCategory = await category.save();
    return res.json(savedCategory);
  } catch (err) {
    console.error("Error uploading image to S3 or saving to DB:", err);
    return res
      .status(400)
      .json({ error: "Failed to upload image or save category" });
  }
};

exports.list = async (req, res) => {
  try {
    const data = await Category.find({});
    res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: "Categories could not be loaded. Please try again later.",
    });
  }
}; 

exports.read = async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.body.limit) || 10;
    const skip = parseInt(req.body.skip) || 0; 
    const category = await Category.findOne({ slug }).populate('postedBy', '_id name username');
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    } 
    const links = await Link.find({ categories: category })
      .populate('postedBy', '_id name username')
      .populate('categories', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
 
    res.json({ category, links });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "An error occurred while fetching category and links" });
  }
};


exports.update = (req, res) => {
  //
};

exports.remove = (req, res) => {
  //
};
