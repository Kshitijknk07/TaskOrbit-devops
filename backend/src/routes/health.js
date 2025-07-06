const express = require("express");
const { sequelize } = require("../config/database");

const router = express.Router();

// Basic health check
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskOrbit API is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Database health check
router.get("/database", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      success: true,
      message: "Database connection is healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Detailed health check
router.get("/detailed", async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();

    // Get system info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    };

    res.status(200).json({
      success: true,
      message: "System is healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      system: systemInfo,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "System health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
