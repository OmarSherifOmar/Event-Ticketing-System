const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

module.exports = function authenticationMiddleware(req, res, next) {
    console.log("Inside authentication middleware");

    // Check for token in cookies
    let token = req.cookies?.token;

    // If no token is found, return an error
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            console.error("Token verification error:", error); // Log the error
            return res.status(403).json({ message: "Invalid token" });
        }

        // Attach the decoded user information to the request object
        req.user = decoded;
        console.log("Decoded user:", decoded); // Log the decoded token
        next(); // Proceed to the next middleware or route handler
    });
};