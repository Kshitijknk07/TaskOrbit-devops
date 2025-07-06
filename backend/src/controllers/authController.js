const authService = require("../services/auth/authService");

class AuthController {
  // Register new user
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.register({
        email,
        password,
        name,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const result = await authService.getProfile(req.user.id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const result = await authService.updateProfile(req.user.id, req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      const result = await authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Logout (client-side token removal)
  async logout(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
