package handlers

import (
	"net/http"
	"strconv"
	"taskorbit-backend/internal/database"
	"taskorbit-backend/internal/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"golang.org/x/crypto/bcrypt"
)

var (
	// Prometheus metrics
	httpRequests = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "endpoint", "status"},
	)

	activeTasks = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "tasks_active_total",
			Help: "Total number of active tasks",
		},
		[]string{"status", "priority"},
	)
)

// SetupRoutes configures all API routes
func SetupRoutes(r *gin.Engine) {
	// Initialize database
	database.InitDatabase()

	// Middleware for CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	})

	// Metrics middleware
	r.Use(func(c *gin.Context) {
		start := time.Now()
		c.Next()
		duration := time.Since(start)

		httpRequests.WithLabelValues(
			c.Request.Method,
			c.FullPath(),
			strconv.Itoa(c.Writer.Status()),
		).Inc()

		// Log request
		println("Request:", c.Request.Method, c.Request.URL.Path, "Status:", c.Writer.Status(), "Duration:", duration.String())
	})

	// Prometheus metrics endpoint
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API routes
	api := r.Group("/api")
	{
		// Authentication routes
		auth := api.Group("/auth")
		{
			auth.POST("/register", registerHandler)
			auth.POST("/login", loginHandler)
		}

		// Task routes
		tasks := api.Group("/tasks")
		{
			tasks.GET("", getTasksHandler)
			tasks.POST("", createTaskHandler)
			tasks.GET("/:id", getTaskHandler)
			tasks.PUT("/:id", updateTaskHandler)
			tasks.DELETE("/:id", deleteTaskHandler)
		}

		// User routes
		users := api.Group("/users")
		{
			users.GET("", getUsersHandler)
			users.GET("/:id", getUserHandler)
		}
	}
}

// Auth Handlers
func registerHandler(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to hash password",
		})
		return
	}

	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
		FullName: req.FullName,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, models.APIResponse{
			Success: false,
			Error:   "User already exists",
		})
		return
	}

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "User registered successfully",
		Data:    user,
	})
}

func loginHandler(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, models.APIResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, models.APIResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Login successful",
		Data: models.AuthResponse{
			Token: "jwt-token-placeholder",
			User:  user,
		},
	})
}

// Task Handlers
func getTasksHandler(c *gin.Context) {
	var tasks []models.Task
	var total int64

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	// Count total tasks
	database.DB.Model(&models.Task{}).Count(&total)

	// Get tasks with pagination and relations
	database.DB.Preload("Creator").Preload("Assignee").
		Offset(offset).Limit(limit).Find(&tasks)

	// Update metrics
	updateTaskMetrics()

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data: models.TaskListResponse{
			Tasks: tasks,
			Total: total,
			Page:  page,
			Limit: limit,
		},
	})
}

func createTaskHandler(c *gin.Context) {
	var req models.CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	// For now, use the first user as creator (in real app, get from JWT)
	var creator models.User
	database.DB.First(&creator)

	task := models.Task{
		Title:       req.Title,
		Description: req.Description,
		Priority:    req.Priority,
		Status:      models.TaskStatusPending,
		CreatorID:   creator.ID,
		AssigneeID:  req.AssigneeID,
		DueDate:     req.DueDate,
	}

	if err := database.DB.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create task",
		})
		return
	}

	// Load relations
	database.DB.Preload("Creator").Preload("Assignee").First(&task, task.ID)

	// Update metrics
	updateTaskMetrics()

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Task created successfully",
		Data:    task,
	})
}

func getTaskHandler(c *gin.Context) {
	id := c.Param("id")
	var task models.Task

	if err := database.DB.Preload("Creator").Preload("Assignee").First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Task not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    task,
	})
}

func updateTaskHandler(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	var req models.UpdateTaskRequest

	if err := database.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Task not found",
		})
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	// Update fields if provided
	if req.Title != nil {
		task.Title = *req.Title
	}
	if req.Description != nil {
		task.Description = *req.Description
	}
	if req.Status != nil {
		task.Status = *req.Status
	}
	if req.Priority != nil {
		task.Priority = *req.Priority
	}
	if req.AssigneeID != nil {
		task.AssigneeID = req.AssigneeID
	}
	if req.DueDate != nil {
		task.DueDate = req.DueDate
	}

	if err := database.DB.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to update task",
		})
		return
	}

	// Load relations
	database.DB.Preload("Creator").Preload("Assignee").First(&task, task.ID)

	// Update metrics
	updateTaskMetrics()

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Task updated successfully",
		Data:    task,
	})
}

func deleteTaskHandler(c *gin.Context) {
	id := c.Param("id")
	var task models.Task

	if err := database.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Task not found",
		})
		return
	}

	if err := database.DB.Delete(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to delete task",
		})
		return
	}

	// Update metrics
	updateTaskMetrics()

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Task deleted successfully",
	})
}

// User Handlers
func getUsersHandler(c *gin.Context) {
	var users []models.User
	database.DB.Find(&users)

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    users,
	})
}

func getUserHandler(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    user,
	})
}

// updateTaskMetrics updates Prometheus metrics for tasks
func updateTaskMetrics() {
	var tasks []models.Task
	database.DB.Find(&tasks)

	// Reset gauges
	activeTasks.Reset()

	// Count tasks by status and priority
	statusCounts := make(map[string]map[string]int)
	for _, task := range tasks {
		status := string(task.Status)
		priority := string(task.Priority)

		if statusCounts[status] == nil {
			statusCounts[status] = make(map[string]int)
		}
		statusCounts[status][priority]++
	}

	// Update metrics
	for status, priorities := range statusCounts {
		for priority, count := range priorities {
			activeTasks.WithLabelValues(status, priority).Set(float64(count))
		}
	}
}
