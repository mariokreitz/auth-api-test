const verifyRole = (role) => {
  return (req, res, next) => {
    const { user } = req;
    if (user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export default verifyRole;
