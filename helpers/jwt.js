const jwt = require("jsonwebtoken");

const generateJWT = (uid = "", name = "", role = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name, role };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Could not generate the token");
        }
        resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
