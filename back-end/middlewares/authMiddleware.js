const JWT = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.authentication?.split(" ");

    if (!token) {
      return res.status(401).json({ msg: "token is required!" });
    }

    const decoded = JWT.verify(token, process.env.SECRET_KEY);

    req._id = decoded._id;
    next();
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

module.exports = { authentication };
