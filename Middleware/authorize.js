const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const authendicateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, body) => {
      if (err) {
        return res.status(403).send("wrong toekn");
      }

      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = authendicateJWT;
