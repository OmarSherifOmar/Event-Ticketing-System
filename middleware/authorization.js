module.exports = function authorizationMiddleware(roles) {
  return (req, res, next) => {
    console.log("Inside authorization middleware");
    console.log("User role:", req.user?.role); // Debugging log

    // Ensure the user is attached to the request object
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user information found" });
    }

    // Check if the user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    next(); // Proceed to the next middleware or route handler
  };
};