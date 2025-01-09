import jwt from "jsonwebtoken";

/**
 * Middleware function to verify a JSON Web Token (JWT) from cookies.
 *
 * @param {object} req - Express request object, expects a JWT in cookies.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 *
 * @returns {object} - Responds with a 401 status and a message if the token is missing or invalid.
 *
 * @description - This function checks for a token in the request cookies,
 * verifies it using a secret from the environment variables, and adds the
 * decoded token data to the request object. If the token is invalid or missing,
 * it returns a 401 status with an appropriate error message.
 */

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default verifyToken;
