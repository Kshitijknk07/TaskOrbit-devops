package database

import (
	"fmt"
	"log"
	"os"
	"taskorbit-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDatabase initializes the database connection
func InitDatabase() {
	var err error

	// Get database connection details from environment
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "taskorbit")
	password := getEnv("DB_PASSWORD", "taskorbit123")
	dbname := getEnv("DB_NAME", "taskorbit")
	sslmode := getEnv("DB_SSLMODE", "disable")

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully")

	// Auto-migrate the schema
	err = DB.AutoMigrate(&models.User{}, &models.Task{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migration completed")

	// Seed initial data
	seedData()
}

// seedData creates initial data for development
func seedData() {
	// Check if users already exist
	var userCount int64
	DB.Model(&models.User{}).Count(&userCount)

	if userCount == 0 {
		// Create demo users
		users := []models.User{
			{
				Username: "admin",
				Email:    "admin@taskorbit.com",
				Password: "$2a$10$8Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5uRQJR4q4q4q4q4q4q4q4q4q4q4q4q4q4",
				FullName: "Admin User",
			},
			{
				Username: "john_doe",
				Email:    "john@example.com",
				Password: "$2a$10$8Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5uRQJR4q4q4q4q4q4q4q4q4q4q4q4q4q4",
				FullName: "John Doe",
			},
			{
				Username: "jane_smith",
				Email:    "jane@example.com",
				Password: "$2a$10$8Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5uRQJR4q4q4q4q4q4q4q4q4q4q4q4q4q4",
				FullName: "Jane Smith",
			},
		}

		for _, user := range users {
			DB.Create(&user)
		}

		log.Println("Demo users created")

		// Create demo tasks
		var adminUser models.User
		DB.Where("username = ?", "admin").First(&adminUser)

		var johnUser models.User
		DB.Where("username = ?", "john_doe").First(&johnUser)

		tasks := []models.Task{
			{
				Title:       "Setup TaskOrbit Infrastructure",
				Description: "Configure Kubernetes, Prometheus, and Grafana for monitoring",
				Status:      models.TaskStatusInProgress,
				Priority:    models.TaskPriorityHigh,
				CreatorID:   adminUser.ID,
				AssigneeID:  &johnUser.ID,
			},
			{
				Title:       "Implement User Authentication",
				Description: "Add JWT-based authentication with password hashing",
				Status:      models.TaskStatusCompleted,
				Priority:    models.TaskPriorityMedium,
				CreatorID:   adminUser.ID,
				AssigneeID:  &johnUser.ID,
			},
			{
				Title:       "Create Task Management API",
				Description: "Develop RESTful APIs for CRUD operations on tasks",
				Status:      models.TaskStatusPending,
				Priority:    models.TaskPriorityHigh,
				CreatorID:   johnUser.ID,
			},
		}

		for _, task := range tasks {
			DB.Create(&task)
		}

		log.Println("Demo tasks created")
	}
}

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}
