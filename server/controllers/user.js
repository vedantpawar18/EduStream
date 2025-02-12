const User = require("../models/user");
const Link = require("../models/link");

exports.read = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const links = await Link.find({ postedBy: user })
      .populate("categories", "name slug")
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    user.hashed_password = undefined;
    user.salt = undefined;

    res.json({ user, links });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Could not fetch user or links" });
  }
};

exports.update = async (req, res) => {
  const { name, password, categories } = req.body;

  if (password && password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { name, password, categories },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ error: "Could not find user to update" });
    }

    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: "Error updating user" });
  }
};
