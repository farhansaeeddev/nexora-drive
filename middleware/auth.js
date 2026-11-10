const jwt = require("jsonwebtoken");

// Gate for pages and file actions. The cookie holds a signed token, not the password.
function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/user/login");
  }

  try {
    // decoded looks like { userID, first_name, iat, exp }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Bad or expired token should not keep sending the browser in a loop
    res.clearCookie("token");
    return res.redirect("/user/login");
  }
}

module.exports = authMiddleware;
