import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  FileText, 
  Activity, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Projects',
      value: '86',
      change: '+8.2%',
      trend: 'up',
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Tasks Completed',
      value: '1,247',
      change: '-3.1%',
      trend: 'down',
      icon: CheckCircle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: '₹45.2L',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'Rajesh Kumar', time: '5 minutes ago', icon: Users, color: 'text-blue-600' },
    { id: 2, action: 'Project updated', user: 'Priya Sharma', time: '15 minutes ago', icon: FileText, color: 'text-green-600' },
    { id: 3, action: 'Task completed', user: 'Amit Patel', time: '1 hour ago', icon: CheckCircle, color: 'text-purple-600' },
    { id: 4, action: 'System alert', user: 'System', time: '2 hours ago', icon: AlertCircle, color: 'text-red-600' },
    { id: 5, action: 'New report generated', user: 'Sneha Reddy', time: '3 hours ago', icon: BarChart3, color: 'text-indigo-600' }
  ];

  const upcomingTasks = [
    { id: 1, title: 'Review quarterly reports', dueDate: 'Today, 4:00 PM', priority: 'high' },
    { id: 2, title: 'Team meeting with developers', dueDate: 'Tomorrow, 10:00 AM', priority: 'medium' },
    { id: 3, title: 'Update system documentation', dueDate: 'Jan 15, 2026', priority: 'low' },
    { id: 4, title: 'Client presentation preparation', dueDate: 'Jan 16, 2026', priority: 'high' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-saf-red-600 to-saf-red-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
            <p className="text-white/90">Here's what's happening with your organization today.</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm text-white/80 mt-2">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-saf-dark-900">{stat.value}</h3>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span className="font-semibold">{stat.change}</span>
                  <span className="text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-4 rounded-xl`}>
                <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-saf-dark-900 flex items-center gap-2">
              <Activity className="h-6 w-6 text-saf-red-600" />
              Recent Activities
            </h2>
            <button className="text-sm text-saf-red-600 hover:text-saf-red-700 font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${activity.color.replace('text-', 'bg-').replace('600', '100')}`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-saf-dark-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-saf-dark-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-saf-red-600" />
              Upcoming Tasks
            </h2>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-4 border-l-4 border-saf-red-600 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-saf-dark-900 text-sm">{task.title}</p>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.dueDate}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-saf-red-600 hover:bg-saf-red-50 rounded-lg font-semibold transition-colors">
            View All Tasks
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-saf-dark-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Add User', icon: Users, color: 'blue' },
            { name: 'New Project', icon: FileText, color: 'green' },
            { name: 'Generate Report', icon: BarChart3, color: 'purple' },
            { name: 'Schedule Meeting', icon: Calendar, color: 'yellow' },
            { name: 'View Analytics', icon: TrendingUp, color: 'indigo' },
            { name: 'System Status', icon: Activity, color: 'red' }
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-saf-red-500 hover:bg-saf-red-50 transition-all duration-200 group"
            >
              <div className={`p-3 rounded-xl bg-${action.color}-100 group-hover:bg-saf-red-100 transition-colors`}>
                <action.icon className={`h-6 w-6 text-${action.color}-600 group-hover:text-saf-red-600 transition-colors`} />
              </div>
              <span className="text-sm font-semibold text-saf-dark-700 group-hover:text-saf-red-700 transition-colors text-center">
                {action.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">System Status: All Systems Operational</h3>
              <p className="text-sm text-green-700">Last checked: {new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-green-700">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

