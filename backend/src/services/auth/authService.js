const jwt = require("jsonwebtoken");
const { User } = require("../../models");

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  }

  // Register new user
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new user
      const user = await User.create({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role || "user",
      });

      // Generate token
      const token = this.generateToken(user.id);

      return {
        success: true,
        data: {
          user: user.toJSON(),
          token,
        },
        message: "User registered successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check if user is active
      if (!user.is_active) {
        throw new Error("Account is deactivated");
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Generate token
      const token = this.generateToken(user.id);

      return {
        success: true,
        data: {
          user: user.toJSON(),
          token,
        },
        message: "Login successful",
      };
    } catch (error) {
      throw error;
    }
  }

  // Get current user profile
  async getProfile(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        data: user.toJSON(),
        message: "Profile retrieved successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Update allowed fields only
      const allowedFields = ["name", "email"];
      const updateFields = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          updateFields[field] = updateData[field];
        }
      });

      await user.update(updateFields);

      return {
        success: true,
        data: user.toJSON(),
        message: "Profile updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Update password
      await user.update({ password: newPassword });

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
