const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        message: "User already exists",
      });
    }
    user = new User(req.body);
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error creating user",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "User not found",
      });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        ok: false,
        message: "Invalid credentials",
      });
    }
    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      message: "login",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error logging in",
    });
  }
};

const renewUser = (req, res = response) => {
  res.json({
    message: "renew",
  });
};

module.exports = {
  createUser,
  loginUser,
  renewUser,
};
