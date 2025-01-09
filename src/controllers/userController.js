import User from "../models/User.js";

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

// (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -verificationToken -resetToken -resetTokenExpiration");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
