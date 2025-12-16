const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  let token = null;

  // 1. Check cookie token
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. Check Authorization header token
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 3. If no token found → block access
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Add user to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
