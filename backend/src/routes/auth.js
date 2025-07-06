const express = require("express");
const { body } = require("express-validator");
const {
  validateRequest,
  commonValidations,
} = require("../middleware/validation/validationMiddleware");
const { authMiddleware } = require("../middleware/auth/authMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

// Register new user
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").isLength({ min: 2, max: 50 }).trim(),
    validateRequest,
  ],
  authController.register
);

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
    validateRequest,
  ],
  authController.login
);

// Get current user profile (protected)
router.get("/profile", authMiddleware, authController.getProfile);

// Update user profile (protected)
router.put(
  "/profile",
  [
    authMiddleware,
    body("name").optional().isLength({ min: 2, max: 50 }).trim(),
    body("email").optional().isEmail().normalizeEmail(),
    validateRequest,
  ],
  authController.updateProfile
);

// Change password (protected)
router.put(
  "/change-password",
  [
    authMiddleware,
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
    validateRequest,
  ],
  authController.changePassword
);

// Logout (protected)
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
