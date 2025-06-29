"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, UserIcon, ChartBarIcon } from "@heroicons/react/24/outline";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  creator: { full_name: string };
  assignee?: { full_name: string };
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    try {
      // Demo data - in real app, fetch from API
      const demoTasks: Task[] = [
        {
          id: 1,
          title: "Setup TaskOrbit Infrastructure",
          description:
            "Configure Kubernetes, Prometheus, and Grafana for monitoring",
          status: "in_progress",
          priority: "high",
          creator: { full_name: "Admin User" },
          assignee: { full_name: "John Doe" },
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          title: "Implement User Authentication",
          description: "Add JWT-based authentication with password hashing",
          status: "completed",
          priority: "medium",
          creator: { full_name: "Admin User" },
          assignee: { full_name: "John Doe" },
          created_at: "2024-01-14T09:00:00Z",
        },
        {
          id: 3,
          title: "Create Task Management API",
          description: "Develop RESTful APIs for CRUD operations on tasks",
          status: "pending",
          priority: "high",
          creator: { full_name: "John Doe" },
          created_at: "2024-01-16T11:00:00Z",
        },
      ];
      setTasks(demoTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "in_progress":
        return "status-in_progress";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "low":
        return "priority-low";
      case "medium":
        return "priority-medium";
      case "high":
        return "priority-high";
      case "urgent":
        return "priority-urgent";
      default:
        return "priority-medium";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">TaskOrbit</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with your tasks.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <ChartBarIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {tasks.length}
            </div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">
              {tasks.filter((t) => t.status === "completed").length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600">
              {tasks.filter((t) => t.status === "in_progress").length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {tasks.filter((t) => t.status === "pending").length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Tasks
            </h2>
            <button className="btn-primary flex items-center space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`${getPriorityClass(
                        task.priority
                      )} font-medium`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                    <span className={getStatusClass(task.status)}>
                      {task.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{task.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    Created by {task.creator.full_name}
                    {task.assignee &&
                      ` • Assigned to ${task.assignee.full_name}`}
                  </div>
                  <div>{new Date(task.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
