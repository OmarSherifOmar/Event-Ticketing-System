const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

module.exports = function authenticationMiddleware(req, res, next) {
  console.log("Inside authentication middleware");

  const cookie = req.cookies;
  let token = cookie?.token;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; 
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      console.error("Token verification failed:", error.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("Decoded user:", decoded);
    req.user = decoded; 
    next();
  });
};