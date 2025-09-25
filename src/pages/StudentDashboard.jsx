import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/ui/DashboardHeader';
import LoadingStateManager from '../components/ui/LoadingStateManager';
import Icon from '../components/AppIcon';
import {LineChart , PieChart , Line , Pie , Cell,Legend ,  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SubjectPerformanceChart = () => {
  const subjectData = [
    { subject: 'Mathematics', current: 85, average: 78, target: 90 },
    { subject: 'Physics', current: 92, average: 82, target: 95 },
    { subject: 'Chemistry', current: 78, average: 75, target: 85 },
    { subject: 'Biology', current: 88, average: 80, target: 90 },
    { subject: 'English', current: 94, average: 85, target: 95 },
    { subject: 'History', current: 82, average: 77, target: 88 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Subject Performance</h3>
          <p className="text-sm text-text-secondary">Current scores vs class average and targets</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-text-secondary">Your Score</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-text-secondary">Class Average</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-text-secondary">Target</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={subjectData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="subject" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="current" 
              name="Your Score"
              fill="var(--color-primary)" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="average" 
              name="Class Average"
              fill="var(--color-secondary)" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="target" 
              name="Target"
              fill="var(--color-warning)" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PredictiveAnalyticsPanel = () => {
  const [selectedPrediction, setSelectedPrediction] = useState('semester');

  const predictions = {
    semester: {
      title: 'Semester End Prediction',
      prediction: '3.85 GPA',
      confidence: 87,
      trend: 'increase',
      details: `Based on your current performance trends, you're projected to achieve a 3.85 GPA by semester end.\n\nKey factors contributing to this prediction:\n• Consistent improvement in Mathematics (+0.3 GPA)\n• Strong performance in Physics and English\n• Recent uptick in assignment completion rates\n\nRecommended actions:\n• Focus additional study time on Chemistry\n• Maintain current study schedule for other subjects\n• Complete pending assignments to boost overall performance`
    },
    graduation: {
      title: 'Graduation Outlook',prediction: 'Magna Cum Laude',confidence: 82,trend: 'increase',
      details: `Your current trajectory suggests graduation with Magna Cum Laude honors.\n\nProjected cumulative GPA: 3.78\n\nTo maintain this trajectory:\n• Continue current performance in core subjects\n• Consider advanced coursework in your strongest areas\n• Maintain consistent study habits\n\nPotential risks:\n• Chemistry performance needs improvement\n• Ensure consistent assignment submission`
    },
    nextSemester: {
      title: 'Next Semester Readiness',prediction: 'Well Prepared',confidence: 91,trend: 'stable',details: `You're well-positioned for next semester's coursework.\n\nStrengths identified:\n• Strong foundation in prerequisite subjects\n• Excellent study habits and time management\n• Consistent performance across multiple subjects\n\nAreas for preparation:\n• Review advanced Chemistry concepts\n• Strengthen mathematical problem-solving skills\n• Consider forming study groups for challenging subjects`
    }
  };

  const currentPrediction = predictions?.[selectedPrediction];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return 'text-success bg-success/10';
    if (confidence >= 70) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increase': return 'TrendingUp';
      case 'decrease': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increase': return 'text-success';
      case 'decrease': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Predictive Analytics</h3>
          <p className="text-sm text-text-secondary">AI-powered insights based on your performance data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Brain" size={20} className="text-primary" />
          <span className="text-sm font-medium text-primary">ML Powered</span>
        </div>
      </div>
      {/* Prediction Type Selector */}
      <div className="flex space-x-2 mb-6 bg-muted rounded-lg p-1">
        {Object.entries(predictions)?.map(([key, pred]) => (
          <button
            key={key}
            onClick={() => setSelectedPrediction(key)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              selectedPrediction === key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-accent'
            }`}
          >
            {pred?.title?.split(' ')?.[0]}
          </button>
        ))}
      </div>
      {/* Prediction Display */}
      <div className="space-y-6">
        {/* Main Prediction */}
        <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="text-sm font-medium text-text-secondary mb-2">
            {currentPrediction?.title}
          </h4>
          <div className="flex items-center justify-center space-x-3 mb-3">
            <p className="text-3xl font-bold text-primary">
              {currentPrediction?.prediction}
            </p>
            <Icon 
              name={getTrendIcon(currentPrediction?.trend)} 
              size={24} 
              className={getTrendColor(currentPrediction?.trend)} 
            />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-text-secondary">Confidence:</span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${getConfidenceColor(currentPrediction?.confidence)}`}>
              {currentPrediction?.confidence}%
            </span>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="FileText" size={16} />
            <span>Detailed Analysis</span>
          </h5>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
              {currentPrediction?.details}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200">
            <Icon name="BookOpen" size={16} />
            <span className="text-sm font-medium">Study Plan</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-border text-text-primary rounded-lg hover:bg-accent transition-colors duration-200">
            <Icon name="Download" size={16} />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};


const PerformanceOverviewCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getChangeIcon = () => {
    if (changeType === 'increase') return 'TrendingUp';
    if (changeType === 'decrease') return 'TrendingDown';
    return 'Minus';
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-success';
    if (changeType === 'decrease') return 'text-error';
    return 'text-text-secondary';
  };

  const getCardColor = () => {
    switch (color) {
      case 'success': return 'border-l-success bg-success/5';
      case 'warning': return 'border-l-warning bg-warning/5';
      case 'error': return 'border-l-error bg-error/5';
      default: return 'border-l-primary bg-primary/5';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 border-l-4 ${getCardColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          color === 'success' ? 'bg-success/10' :
          color === 'warning' ? 'bg-warning/10' :
          color === 'error'? 'bg-error/10' : 'bg-primary/10'
        }`}>
          <Icon 
            name={icon} 
            size={20} 
            className={
              color === 'success' ? 'text-success' :
              color === 'warning' ? 'text-warning' :
              color === 'error'? 'text-error' : 'text-primary'
            } 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        {change && (
          <div className="flex items-center space-x-1">
            <Icon name={getChangeIcon()} size={16} className={getChangeColor()} />
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </span>
            <span className="text-sm text-text-secondary">from last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

const GradeProgressChart = () => {
  const gradeData = [
    { month: 'Jan', gpa: 3.2, target: 3.5 },
    { month: 'Feb', gpa: 3.4, target: 3.5 },
    { month: 'Mar', gpa: 3.1, target: 3.5 },
    { month: 'Apr', gpa: 3.6, target: 3.5 },
    { month: 'May', gpa: 3.8, target: 3.5 },
    { month: 'Jun', gpa: 3.7, target: 3.5 },
    { month: 'Jul', gpa: 3.9, target: 3.5 },
    { month: 'Aug', gpa: 3.8, target: 3.5 },
    { month: 'Sep', gpa: 3.9, target: 3.5 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary">{`Month: ${label}`}</p>
          <p className="text-sm text-primary">
            {`Current GPA: ${payload?.[0]?.value}`}
          </p>
          <p className="text-sm text-text-secondary">
            {`Target GPA: ${payload?.[1]?.value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Grade Progress Over Time</h3>
          <p className="text-sm text-text-secondary">Your GPA trend for the current academic year</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-text-secondary">Current GPA</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-text-secondary rounded-full"></div>
            <span className="text-text-secondary">Target GPA</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={gradeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              domain={[2.5, 4.0]}
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="gpa" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="var(--color-text-secondary)" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


const AssignmentCompletionChart = () => {
  const assignmentData = [
    { name: 'Completed', value: 78, color: 'var(--color-success)' },
    { name: 'In Progress', value: 15, color: 'var(--color-warning)' },
    { name: 'Overdue', value: 4, color: 'var(--color-error)' },
    { name: 'Not Started', value: 3, color: 'var(--color-text-secondary)' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary">{data?.name}</p>
          <p className="text-sm" style={{ color: data?.payload?.color }}>
            {`${data?.value} assignments (${((data?.value / 100) * 100)?.toFixed(1)}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry?.color }}
            ></div>
            <span className="text-sm text-text-secondary">{entry?.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Assignment Completion Status</h3>
        <p className="text-sm text-text-secondary">Overview of your assignment progress this semester</p>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={assignmentData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {assignmentData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-success">78</p>
          <p className="text-sm text-text-secondary">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-error">4</p>
          <p className="text-sm text-text-secondary">Overdue</p>
        </div>
      </div>
    </div>
  );
};
const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('semester');
  const navigate = useNavigate();

  // Mock user data
  const mockUser = {
    id: 'student_001',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    role: 'student',
    studentId: 'STU2024001',
    major: 'Computer Science',
    year: 'Junior',
    semester: 'Fall 2024',
    lastLogin: '2025-09-09 15:30',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  };

  // Performance overview data
  const performanceData = [
    {
      title: 'Current GPA',
      value: '3.85',
      change: '+0.12',
      changeType: 'increase',
      icon: 'GraduationCap',
      color: 'primary'
    },
    {
      title: 'Course Completion',
      value: '87%',
      change: '+5%',
      changeType: 'increase',
      icon: 'BookOpen',
      color: 'success'
    },
    {
      title: 'Assignment Score',
      value: '92.3%',
      change: '+2.1%',
      changeType: 'increase',
      icon: 'FileText',
      color: 'success'
    },
    {
      title: 'Attendance Rate',
      value: '96.8%',
      change: '-0.5%',
      changeType: 'decrease',
      icon: 'Calendar',
      color: 'warning'
    }
  ];

  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'semester', label: 'This Semester' },
    { value: 'year', label: 'Academic Year' }
  ];

  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!authToken || userRole !== 'student') {
      navigate('/user-login');
      return;
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/user-login');
  };

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    // In a real app, this would trigger data refetch
  };

  if (loading) {
    return <LoadingStateManager type="fullpage" message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader 
        user={user} 
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Welcome back, {user?.name?.split(' ')?.[0]}!
              </h1>
              <p className="text-text-secondary mt-1">
                {user?.major} • {user?.year} • {user?.semester}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-text-secondary" />
                <select
                  value={selectedTimeRange}
                  onChange={(e) => handleTimeRangeChange(e?.target?.value)}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {timeRanges?.map((range) => (
                    <option key={range?.value} value={range?.value}>
                      {range?.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Quick Actions */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200">
                <Icon name="Plus" size={16} />
                <span className="text-sm font-medium">New Goal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceData?.map((data, index) => (
            <PerformanceOverviewCard
              key={index}
              title={data?.title}
              value={data?.value}
              change={data?.change}
              changeType={data?.changeType}
              icon={data?.icon}
              color={data?.color}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Grade Progress Chart - Takes 2 columns */}
          <div className="xl:col-span-2">
            <GradeProgressChart />
          </div>
          
          {/* Predictive Analytics Panel */}
          <div className="xl:col-span-1">
            <PredictiveAnalyticsPanel />
          </div>
        </div>

        {/* Subject Performance and Assignment Completion */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <SubjectPerformanceChart />
          <AssignmentCompletionChart />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;