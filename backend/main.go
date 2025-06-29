package main

import (
	"log"
	"os"
	"taskorbit-backend/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// Set Gin mode
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "taskorbit-backend",
		})
	})

	// Setup all routes
	handlers.SetupRoutes(r)

	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("TaskOrbit backend starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
// CI/CD Test: Triggering GitHub Actions workflow - Mon Jun 30 02:27:09 AM IST 2025
