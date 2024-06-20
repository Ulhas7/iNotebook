const jwt = require("jsonwebtoken");
const JWT_SECRET = "harryisagood&boy";

const fetchuser = (req, res, next) => {
  //Get the user from the jwwt token and add i to req object

  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please athenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please athenticate using valid token 2" });
  }
};

module.exports = fetchuser;
