import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { logAudit } from "../service/audit.service.js";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";

/**
 * @description Create a new user
 * @route POST /admin/users
 * @access Admin
 * @param {string} username - Username chosen by user
 * @param {string} email - Email of user
 * @param {string} password - Password chosen by user
 * @param {string} role - The role of the user being created (either "user" or "admin")
 * @returns {object} Message indicating user was created successfully, and the newly created user object
 * @example
 * // Request
 * POST /admin/users HTTP/1.1
 * {
 *   "username": "testuser",
 *   "email": "testuser@example.com",
 *   "password": "testpassword",
 *   "role": "user"
 * }
 *
 * // Response
 * HTTP/1.1 201 Created
 * {
 *   "message": "User created successfully",
 *   "user": {
 *     "_id": "616269052588",
 *     "username": "testuser",
 *     "email": "testuser@example.com",
 *     "role": "user",
 *     "firstName": "",
 *     "lastName": "",
 *     "profilePicture": ""
 *   }
 * }
 */
export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verificationToken;
    user.role = role;
    await user.save();

    await sendVerificationEmail(user, verificationToken);

    logAudit(req.user.username, "create_user", `Created user ${username} with role ${role}`, req.ip);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    logAudit(req.user.username, "create_user_error", error.message, req.ip);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Update an existing user
 * @route PUT /admin/users/:id
 * @access Admin
 * @param {string} id - The ID of the user to update
 * @param {string} [username] - The new username
 * @param {string} [email] - The new email address
 * @param {string} [password] - The new password
 * @param {string} [role] - The new role
 * @param {boolean} [isVerified] - Whether the user is verified or not
 * @returns {object} JSON response with a message
 * @example
 * // Request
 * PUT /admin/users/616269052588 HTTP/1.1
 * Content-Type: application/json
 * {
 *   "username": "newtestuser",
 *   "email": "newtestuser@example.com",
 *   "password": "newtestpassword",
 *   "role": "admin",
 *   "isVerified": true
 * }
 *
 * // Response
 * HTTP/1.1 200 OK
 * {
 *   "message": "User updated successfully"
 * }
 */
export const updateUser = async (req, res) => {
  const { userId, username: newUsername, email: newEmail, password: newPassword, role: newRole, isVerified: newIsVerified } = req.body;

  const updateData = {};

  if (newUsername) updateData.username = newUsername;
  if (newEmail) updateData.email = newEmail;
  if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);
  if (newRole) updateData.role = newRole;
  if (newIsVerified !== undefined) updateData.isVerified = newIsVerified;

  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    logAudit(req.user.username, "update_user", `Updated user ${user.username} with role ${user.role}`, req.ip);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    logAudit(req.user.username, "update_user_error", error.message, req.ip);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Delete a user by userId
 * @route DELETE /admin/users/:userId
 * @access Admin
 * @param {string} userId - User ID to delete
 * @returns {object} Message indicating whether the user was successfully deleted or not found
 */
export const deleteUser = async (req, res) => {
  const { userId } = req.body;

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
