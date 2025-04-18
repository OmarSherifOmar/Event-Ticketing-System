module.exports = function authorizationMiddleware(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user information found" });
    }
    console.log("User role:", req.user.role);
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};