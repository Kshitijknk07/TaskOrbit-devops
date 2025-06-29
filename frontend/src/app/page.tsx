"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    // Fetch basic stats
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // This is a simplified example - in real app, you'd fetch from your API
      setStats({
        totalTasks: 12,
        completedTasks: 8,
        activeTasks: 4,
        totalUsers: 3,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">
                  TaskOrbit
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="btn-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Task Management
            <span className="block text-primary-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            TaskOrbit helps teams collaborate efficiently with real-time
            updates, intuitive design, and powerful DevOps integration.
          </p>
          <div className="space-x-4">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card text-center">
            <ChartBarIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalTasks}
            </div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
          <div className="card text-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {stats.completedTasks}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="card text-center">
            <ClockIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {stats.activeTasks}
            </div>
            <div className="text-gray-600">Active Tasks</div>
          </div>
          <div className="card text-center">
            <UserGroupIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalUsers}
            </div>
            <div className="text-gray-600">Team Members</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose TaskOrbit?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Real-time Collaboration
            </h3>
            <p className="text-gray-600">
              Work together seamlessly with live updates and instant
              notifications.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">DevOps Integration</h3>
            <p className="text-gray-600">
              Built with modern DevOps practices including CI/CD and monitoring.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Focused</h3>
            <p className="text-gray-600">
              Designed for teams with user management and role-based access.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>
              &copy; 2024 TaskOrbit. Built with ❤️ using modern DevOps
              practices.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
