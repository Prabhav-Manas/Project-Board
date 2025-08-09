const jwt = require("jsonwebtoken");

// Middleware to verify JWT token and attach user info to the request
function verifyToken(req, res, next) {
  // Extract the token from the Authorization header
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Auth failed: No token provided" });
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user object to the request
    req.user = { _id: decoded.user.id }; // `userId` should match the payload structure in your token

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: "Auth failed: Invalid token" });
  }
}

module.exports = verifyToken;
