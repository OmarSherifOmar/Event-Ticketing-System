const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

module.exports = function authenticationMiddleware(req, res, next) {
  console.log("Inside authentication middleware");

  // Check for token in cookies
  const cookie = req.cookies;
  let token = cookie?.token;

  // If no token in cookies, check the Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    }
  }

  // If no token is found, return an error
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      console.error("Token verification failed:", error.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach the decoded user to the request object
    console.log("Decoded user:", decoded);
    req.user = decoded; // Ensure the decoded user is attached to req.user
    next();
  });
};