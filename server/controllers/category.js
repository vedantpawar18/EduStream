const Category = require("../models/category");
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

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not upload" });
    }
    let {
      name: [name],
      content: [content],
    } = fields;

    const { image } = files;

    if (!image || image.length === 0) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imagePath = image[0].filepath;
    const imageType = image[0].mimetype || "image/jpg";
    const imageSize = image[0].size;

    if (imageSize > 2000000) {
      return res.status(400).json({ error: "Image should be less than 2MB" });
    }

    const slug = slugify(name);

    let category = new Category({ name, content, slug });

    const imageKey = `category/${uuidv4()}`;

    const params = {
      Bucket: "myextendedbucket",
      Key: imageKey,
      Body: fs.createReadStream(imagePath),
      ContentType: imageType,
      ACL: "public-read",
    };

    try {
      const command = new PutObjectCommand(params);
      const data = await s3.send(command);

      console.log("AWS UPLOAD RES DATA", data);

      category.image = {
        url: `https://myextendedbucket.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${imageKey}`, // Use the same imageKey
        key: imageKey,
      };
      const savedCategory = await category.save();
      return res.json(savedCategory);
    } catch (err) {
      console.log("S3 Upload or DB save error:", err);
      return res
        .status(400)
        .json({ error: "Upload to S3 or saving to DB failed" });
    }
  });
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

exports.read = (req, res) => {
  //
};

exports.update = (req, res) => {
  //
};

exports.remove = (req, res) => {
  //
};
