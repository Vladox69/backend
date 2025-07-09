const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

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
    const token = await generateJWT(user.id, user.name, user.role);
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      role:user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error creating user",
    });
  }
};

const updatePassword = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({
        ok:false,
        message:"User not found"
      });
    }
    const salt = bcrypt.genSaltSync();
    const newPassword = bcrypt.hashSync(password, salt);
    const updatedUser = await User.findByIdAndUpdate(user.id,{
      password:newPassword
    },{new:true})
    const token = await generateJWT(user.id, user.name, user.role);
    res.status(201).json({
      ok: true,
      uid: updatedUser.id,
      name: updatedUser.name,
      role: updatedUser.role,
      token,
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
    const token = await generateJWT(user.id, user.name,user.role);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      role:user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error logging in",
    });
  }
};

const renewUser = async (req, res = response) => {
  const { uid, name, role } = req;
  const token = await generateJWT(uid, name, role);
  res.json({
    ok: true,
    message: "renew",
    token,
    uid,
    name,
    role
  });
};

module.exports = {
  createUser,
  updatePassword,
  loginUser,
  renewUser,
};
