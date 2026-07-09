const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT and attaches the logged-in user to req.user
const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user no longer exists" });
    }

    req.user = user; // full user doc (minus password) available in every controller after this
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired, please log in again",
      });
    }
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};

// Optional role guard: authorize("candidate"), authorize("voter", "candidate"), etc.
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};

module.exports = { protect, authorize };
