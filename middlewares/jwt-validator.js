const { response } = require("express");
const jwt = require("jsonwebtoken");

const jwtValidator = (req, res = response, next) => {
  const token = req.header("X-Token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "No token in the request",
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Invalid token",
    });
  }

  next();
};

module.exports = {
  jwtValidator,
};
