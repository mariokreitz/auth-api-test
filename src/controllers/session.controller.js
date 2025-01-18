/**
 * @description Get the role of the currently logged in user
 * @route GET /session
 * @access User
 * @returns {object} JSON response with a single key-value pair for the user's role
 * @example
 * // Request
 * GET /session HTTP/1.1
 * Authorization: Bearer <token>
 *
 * // Response
 * HTTP/1.1 200 OK
 * {
 *   "role": "user"
 * }
 */
export const getUserRole = async (req, res) => {
  try {
    const userRole = req.user.role;

    res.status(200).json({
      role: userRole,
      views: req.session.views,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
