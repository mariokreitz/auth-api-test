/**
 * Verify that the user has a certain role
 * @param {string} role - The required role
 * @returns {(req: Request, res: Response, next: NextFunction) => void}
 * @example
 * const verifyAdmin = verifyRole("admin");
 * app.get("/admin-only", verifyAdmin, (req, res) => {
 *   res.send("This route is only accessible by an admin");
 * });
 */
const verifyRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export default verifyRole;
