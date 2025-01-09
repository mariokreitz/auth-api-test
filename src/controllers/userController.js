import User from "../models/User.js";

/**
 * @description Get the profile of the currently logged in user
 * @route GET /user/profile
 * @access User
 * @returns {object} The user object, minus sensitive fields
 * @example
 * // Request
 * GET /user/profile HTTP/1.1
 * Authorization: Bearer <token>
 *
 * // Response
 * HTTP/1.1 200 OK
 * {
 *   "_id": "616269052588",
 *   "username": "testuser",
 *   "email": "testuser@example.com",
 *   "role": "user",
 *   "firstName": "",
 *   "lastName": "",
 *   "profilePicture": ""
 * }
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password -verificationToken -resetToken -resetTokenExpiration");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Update the profile of the currently logged in user
 * @route PUT /user/profile
 * @access User
 * @param {string} firstName - New first name of the user
 * @param {string} lastName - New last name of the user
 * @param {string} username - New username of the user
 * @returns {object} Message indicating profile was updated successfully and the updated user object
 */

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, { firstName, lastName, username }, { new: true, runValidators: true }).select(
      "-password -verificationToken -resetToken -resetTokenExpiration"
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Update the profile picture of the currently logged in user
 * @route PUT /user/profile/picture
 * @access User
 * @param {string} profilePicture - New profile picture of the user
 * @returns {object} Message indicating profile picture was updated successfully and the updated user object
 */
export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true, runValidators: true }).select(
      "-password -verificationToken -resetToken -resetTokenExpiration"
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile picture updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Log out the currently logged in user
 * @route POST /user/logout
 * @access User
 * @returns {object} Message indicating logout was successful
 */
export const logout = (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
