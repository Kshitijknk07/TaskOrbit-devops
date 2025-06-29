package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Username  string         `json:"username" gorm:"uniqueIndex;not null"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"` // Hidden from JSON
	FullName  string         `json:"full_name"`
	Avatar    string         `json:"avatar"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	AssignedTasks []Task `json:"assigned_tasks,omitempty" gorm:"foreignKey:AssigneeID"`
	CreatedTasks  []Task `json:"created_tasks,omitempty" gorm:"foreignKey:CreatorID"`
}

// Task represents a task in the system
type Task struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Title       string         `json:"title" gorm:"not null"`
	Description string         `json:"description"`
	Status      TaskStatus     `json:"status" gorm:"default:pending"`
	Priority    TaskPriority   `json:"priority" gorm:"default:medium"`
	DueDate     *time.Time     `json:"due_date"`
	CreatorID   uint           `json:"creator_id" gorm:"not null"`
	AssigneeID  *uint          `json:"assignee_id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	Creator  User  `json:"creator" gorm:"foreignKey:CreatorID"`
	Assignee *User `json:"assignee,omitempty" gorm:"foreignKey:AssigneeID"`
}

// TaskStatus represents the status of a task
type TaskStatus string

const (
	TaskStatusPending    TaskStatus = "pending"
	TaskStatusInProgress TaskStatus = "in_progress"
	TaskStatusCompleted  TaskStatus = "completed"
	TaskStatusCancelled  TaskStatus = "cancelled"
)

// TaskPriority represents the priority of a task
type TaskPriority string

const (
	TaskPriorityLow    TaskPriority = "low"
	TaskPriorityMedium TaskPriority = "medium"
	TaskPriorityHigh   TaskPriority = "high"
	TaskPriorityUrgent TaskPriority = "urgent"
)

// CreateTaskRequest represents the request to create a new task
type CreateTaskRequest struct {
	Title       string       `json:"title" binding:"required"`
	Description string       `json:"description"`
	Priority    TaskPriority `json:"priority"`
	AssigneeID  *uint        `json:"assignee_id"`
	DueDate     *time.Time   `json:"due_date"`
}

// UpdateTaskRequest represents the request to update an existing task
type UpdateTaskRequest struct {
	Title       *string       `json:"title"`
	Description *string       `json:"description"`
	Status      *TaskStatus   `json:"status"`
	Priority    *TaskPriority `json:"priority"`
	AssigneeID  *uint         `json:"assignee_id"`
	DueDate     *time.Time    `json:"due_date"`
}

// LoginRequest represents the login request
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// RegisterRequest represents the registration request
type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name"`
}

// AuthResponse represents the authentication response
type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// TaskListResponse represents the response for task listing
type TaskListResponse struct {
	Tasks []Task `json:"tasks"`
	Total int64  `json:"total"`
	Page  int    `json:"page"`
	Limit int    `json:"limit"`
}

// APIResponse represents a generic API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}
