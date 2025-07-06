const express = require("express");
const { body } = require("express-validator");
const {
  validateRequest,
} = require("../middleware/validation/validationMiddleware");
const { authMiddleware } = require("../middleware/auth/authMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authMiddleware);

// Get current user profile
router.get("/profile", authController.getProfile);

// Update user profile
router.put(
  "/profile",
  [
    body("name").optional().isLength({ min: 2, max: 50 }).trim(),
    body("email").optional().isEmail().normalizeEmail(),
    validateRequest,
  ],
  authController.updateProfile
);

// Change password
router.put(
  "/change-password",
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
    validateRequest,
  ],
  authController.changePassword
);

module.exports = router;
