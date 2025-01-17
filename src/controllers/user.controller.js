import User from "../models/user.model.js";

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
 * @param {string} [username] - New username
 * @param {string} [firstName] - New first name
 * @param {string} [lastName] - New last name
 * @param {string} [email] - New email
 * @param {string} [password] - New password
 * @returns {object} Message indicating user was updated successfully
 * @example
 * // Request
 * PUT /user/profile HTTP/1.1
 * Content-Type: application/json
 * {
 *   "username": "newtestuser",
 *   "firstName": "newFirst",
 *   "lastName": "newLast",
 *   "email": "newtestuser@example.com",
 *   "password": "newtestpassword"
 * }
 *
 * // Response
 * HTTP/1.1 200 OK
 * {
 *   "message": "User updated successfully"
 * }
 */
export const updateUser = async (req, res) => {
  const { userId, username: newUsername, firstName: newFirstName, lastName: newLastName, email: newEmail } = req.body;

  const updateData = {};

  if (newUsername) updateData.username = newUsername;
  if (newEmail) updateData.email = newEmail;
  if (newFirstName) updateData.firstName = newFirstName;
  if (newLastName) updateData.lastName = newLastName;
  if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);

  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    logAudit(req.user.username, "user_update_profile", `Updated user ${user.username} with role ${user.role}`, req.ip);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    logAudit(req.user.username, "user_update_error", error.message, req.ip);
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
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    domain: "api.mario-kreitz.dev",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
