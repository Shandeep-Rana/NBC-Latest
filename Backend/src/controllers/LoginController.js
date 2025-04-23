const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

const generateAuthToken = (userId, email, roleName) => {
  return jwt.sign(
    { userId, email, roleName },
    "your-secret-key",
    { expiresIn: "2d" }
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isactivated) {
      return res.status(401).json({ error: "Account not verified." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const roleNameData = await userModel.getRoleNameByEmail(email); 

    const roleNameArray = roleNameData.map(row => row.roleName);

    if (!roleNameData || roleNameData.length === 0) {
      return res.status(500).json({ error: "Role name not found" });
    }

    const token = generateAuthToken(user.userId, user.email);

    res.status(200).json({
      token,
      roleName: roleNameArray,
      email: user.email,
      userProfile: `${URL}/userProfile/${user.userProfile} ` || null,
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, password } = req.body;

    const user = await userModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect old password" });
    }

    await userModel.updateUserPassword(userId, password);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during password change:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  login, changePassword
};