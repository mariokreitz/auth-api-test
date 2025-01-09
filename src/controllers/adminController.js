import User from "../models/User.js";

/**
 * @description Delete a user by ID
 * @route DELETE /admin/users/:userId
 * @access Admin
 * @param {string} userId - User ID to delete
 * @returns {object} Message indicating user was deleted successfully
 */
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Update a user's role
 * @route PUT /admin/users/role
 * @access Admin
 * @param {string} userId - User ID to update
 * @param {string} role - New role to assign to the user
 * @returns {object} Message indicating user role was updated successfully, and the updated user object
 */

export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Get all users
 * @route GET /admin/users
 * @access Admin
 * @returns {array} Array of all user objects
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -verificationToken -resetToken -resetTokenExpiration");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
