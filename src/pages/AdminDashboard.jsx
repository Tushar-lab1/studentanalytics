import React, { useState, useEffect , useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/ui/DashboardHeader";
import LoadingStateManager from "../components/ui/LoadingStateManager";
import Icon from "../components/AppIcon";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import Button from "../components/ui/Button";
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';

const StudentTable = ({ students, onStudentSelect, onBulkAction }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStudents = useMemo(() => {
    return [...students]?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [students, sortField, sortDirection]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return sortedStudents?.slice(startIndex, startIndex + studentsPerPage);
  }, [sortedStudents, currentPage]);

  const totalPages = Math.ceil(sortedStudents?.length / studentsPerPage);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(paginatedStudents?.map(student => student?.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId, checked) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents?.filter(id => id !== studentId));
    }
  };

  const getRiskBadge = (riskLevel) => {
    const configs = {
      low: { color: 'bg-success/10 text-success', label: 'Low Risk' },
      medium: { color: 'bg-warning/10 text-warning', label: 'Medium Risk' },
      high: { color: 'bg-error/10 text-error', label: 'High Risk' }
    };
    
    const config = configs?.[riskLevel] || configs?.low;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <Icon name="TrendingUp" size={16} className="text-success" />;
    if (trend < 0) return <Icon name="TrendingDown" size={16} className="text-error" />;
    return <Icon name="Minus" size={16} className="text-text-secondary" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Bulk Actions */}
      {selectedStudents?.length > 0 && (
        <div className="bg-primary/5 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {selectedStudents?.length} student{selectedStudents?.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                iconName="Download"
                onClick={() => onBulkAction('export', selectedStudents)}
              >
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                iconName="Mail"
                onClick={() => onBulkAction('notify', selectedStudents)}
              >
                Notify
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                iconName="AlertTriangle"
                onClick={() => onBulkAction('intervention', selectedStudents)}
              >
                Schedule Intervention
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedStudents?.length === paginatedStudents?.length && paginatedStudents?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th 
                className="p-4 text-left cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-text-primary">Student Name</span>
                  <Icon 
                    name={sortField === 'name' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="text-text-secondary" 
                  />
                </div>
              </th>
              <th 
                className="p-4 text-left cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('gpa')}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-text-primary">Current GPA</span>
                  <Icon 
                    name={sortField === 'gpa' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="text-text-secondary" 
                  />
                </div>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-text-primary">Trend</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-text-primary">Risk Level</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-text-primary">Department</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-text-primary">Last Activity</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-text-primary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents?.map((student) => (
              <tr key={student?.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents?.includes(student?.id)}
                    onChange={(e) => handleSelectStudent(student?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {student?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{student?.name}</p>
                      <p className="text-sm text-text-secondary">{student?.studentId}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-text-primary">{student?.gpa}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(student?.trend)}
                    <span className="text-sm text-text-secondary">
                      {student?.trend > 0 ? '+' : ''}{student?.trend}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  {getRiskBadge(student?.riskLevel)}
                </td>
                <td className="p-4">
                  <span className="text-sm text-text-primary">{student?.department}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-text-secondary">{student?.lastActivity}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onStudentSelect(student)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MessageSquare"
                    >
                      Contact
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {paginatedStudents?.map((student) => (
          <div key={student?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedStudents?.includes(student?.id)}
                  onChange={(e) => handleSelectStudent(student?.id, e?.target?.checked)}
                  className="rounded border-border"
                />
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {student?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-text-primary">{student?.name}</p>
                  <p className="text-sm text-text-secondary">{student?.studentId}</p>
                </div>
              </div>
              {getRiskBadge(student?.riskLevel)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-text-secondary">GPA</p>
                <p className="font-semibold text-text-primary">{student?.gpa}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Trend</p>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(student?.trend)}
                  <span className="text-sm text-text-secondary">
                    {student?.trend > 0 ? '+' : ''}{student?.trend}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Department</p>
                <p className="text-sm text-text-primary">{student?.department}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Last Activity</p>
                <p className="text-sm text-text-primary">{student?.lastActivity}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                onClick={() => onStudentSelect(student)}
                fullWidth
              >
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="MessageSquare"
                fullWidth
              >
                Contact
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, sortedStudents?.length)} of {sortedStudents?.length} students
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-text-primary">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronRight"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentDetailModal = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !student) return null;

  // Mock detailed student data
  const studentDetails = {
    ...student,
    email: `${student?.name?.toLowerCase()?.replace(' ', '.')}@university.edu`,
    phone: '+1 (555) 123-4567',
    address: '123 University Ave, College Town, ST 12345',
    enrollmentDate: '2022-08-15',
    advisor: 'Dr. Sarah Johnson',
    credits: 45,
    expectedGraduation: '2026-05-15'
  };

  const performanceHistory = [
    { semester: 'Fall 2022', gpa: 3.1, credits: 15 },
    { semester: 'Spring 2023', gpa: 3.3, credits: 16 },
    { semester: 'Fall 2023', gpa: 3.2, credits: 15 },
    { semester: 'Spring 2024', gpa: 3.4, credits: 17 },
    { semester: 'Fall 2024', gpa: 3.3, credits: 16 }
  ];

  const courseGrades = [
    { course: 'Advanced Algorithms', grade: 'A-', credits: 3, professor: 'Dr. Smith' },
    { course: 'Database Systems', grade: 'B+', credits: 3, professor: 'Dr. Johnson' },
    { course: 'Software Engineering', grade: 'A', credits: 4, professor: 'Dr. Brown' },
    { course: 'Machine Learning', grade: 'B', credits: 3, professor: 'Dr. Davis' },
    { course: 'Computer Networks', grade: 'A-', credits: 3, professor: 'Dr. Wilson' }
  ];

  const attendanceData = [
    { week: 'Week 1', attendance: 100 },
    { week: 'Week 2', attendance: 95 },
    { week: 'Week 3', attendance: 90 },
    { week: 'Week 4', attendance: 85 },
    { week: 'Week 5', attendance: 95 },
    { week: 'Week 6', attendance: 100 },
    { week: 'Week 7', attendance: 80 },
    { week: 'Week 8', attendance: 90 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { id: 'courses', label: 'Current Courses', icon: 'BookOpen' },
    { id: 'attendance', label: 'Attendance', icon: 'Calendar' },
    { id: 'predictions', label: 'Predictions', icon: 'Zap' }
  ];

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'high': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getGradeColor = (grade) => {
    if (grade?.startsWith('A')) return 'text-success bg-success/10';
    if (grade?.startsWith('B')) return 'text-primary bg-primary/10';
    if (grade?.startsWith('C')) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary-foreground">
                {studentDetails?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{studentDetails?.name}</h2>
              <p className="text-text-secondary">{studentDetails?.studentId} • {studentDetails?.department}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(studentDetails?.riskLevel)}`}>
              {studentDetails?.riskLevel?.charAt(0)?.toUpperCase() + studentDetails?.riskLevel?.slice(1)} Risk
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-muted/50'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Email:</span>
                      <span className="text-text-primary">{studentDetails?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Phone:</span>
                      <span className="text-text-primary">{studentDetails?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Enrollment Date:</span>
                      <span className="text-text-primary">{new Date(studentDetails.enrollmentDate)?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Academic Advisor:</span>
                      <span className="text-text-primary">{studentDetails?.advisor}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Academic Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Current GPA:</span>
                      <span className="text-text-primary font-semibold">{studentDetails?.gpa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Credits Completed:</span>
                      <span className="text-text-primary">{studentDetails?.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Expected Graduation:</span>
                      <span className="text-text-primary">{new Date(studentDetails.expectedGraduation)?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Performance Trend:</span>
                      <div className="flex items-center space-x-1">
                        <Icon 
                          name={studentDetails?.trend > 0 ? 'TrendingUp' : studentDetails?.trend < 0 ? 'TrendingDown' : 'Minus'} 
                          size={16} 
                          className={studentDetails?.trend > 0 ? 'text-success' : studentDetails?.trend < 0 ? 'text-error' : 'text-text-secondary'} 
                        />
                        <span className="text-text-primary">
                          {studentDetails?.trend > 0 ? '+' : ''}{studentDetails?.trend}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">GPA Trend Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="semester" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[2.5, 4.0]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gpa" 
                        stroke="#2563EB" 
                        strokeWidth={3}
                        dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Current Semester Courses</h3>
              <div className="space-y-3">
                {courseGrades?.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary">{course?.course}</h4>
                      <p className="text-sm text-text-secondary">
                        {course?.professor} • {course?.credits} credits
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course?.grade)}`}>
                      {course?.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Weekly Attendance Rate</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Attendance']}
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="attendance" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Zap" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">AI-Powered Predictions</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-text-primary mb-2">Expected End-of-Semester GPA</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(3.4 / 4.0) * 100}%` }}
                            />
                          </div>
                          <span className="text-lg font-semibold text-primary">3.4</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                          85% confidence • Based on current performance trends
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-text-primary mb-2">Risk Assessment</h4>
                        <p className="text-sm text-text-secondary">
                          Student shows stable performance with slight improvement trend. 
                          Recommended actions: Continue current study patterns, consider advanced coursework.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-text-primary mb-2">Intervention Recommendations</h4>
                        <ul className="text-sm text-text-secondary space-y-1">
                          <li>• Schedule regular check-ins with academic advisor</li>
                          <li>• Consider joining study groups for challenging subjects</li>
                          <li>• Explore research opportunities in area of interest</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Mail"
            >
              Send Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Phone"
            >
              Schedule Call
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
            >
              Export Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="AlertTriangle"
            >
              Flag for Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricsCard = ({ title, value, change, changeType, icon, description }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-text-secondary';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
          </div>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{change}</span>
          </div>
          <p className="text-xs text-text-secondary">{description}</p>
        </div>
      )}
    </div>
  );
};

const FilterControls = ({ onFilterChange, onExport, totalStudents }) => {
  const [filters, setFilters] = useState({
    department: '',
    riskLevel: '',
    gpaRange: '',
    academicYear: '',
    searchTerm: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business Administration' }
  ];

  const riskLevelOptions = [
    { value: '', label: 'All Risk Levels' },
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' }
  ];

  const gpaRangeOptions = [
    { value: '', label: 'All GPA Ranges' },
    { value: '3.5-4.0', label: '3.5 - 4.0 (Excellent)' },
    { value: '3.0-3.5', label: '3.0 - 3.5 (Good)' },
    { value: '2.5-3.0', label: '2.5 - 3.0 (Average)' },
    { value: '2.0-2.5', label: '2.0 - 2.5 (Below Average)' },
    { value: '0-2.0', label: 'Below 2.0 (At Risk)' }
  ];

  const academicYearOptions = [
    { value: '', label: 'All Academic Years' },
    { value: '2024-2025', label: '2024-2025' },
    { value: '2023-2024', label: '2023-2024' },
    { value: '2022-2023', label: '2022-2023' },
    { value: '2021-2022', label: '2021-2022' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      department: '',
      riskLevel: '',
      gpaRange: '',
      academicYear: '',
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">Filter Students</h3>
          {hasActiveFilters && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={onExport}
          >
            Export Data
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName={showAdvanced ? 'ChevronUp' : 'ChevronDown'}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Less Filters' : 'More Filters'}
          </Button>
        </div>
      </div>
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search by student name or ID..."
          value={filters?.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
          className="max-w-md"
        />
      </div>
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Department"
          options={departmentOptions}
          value={filters?.department}
          onChange={(value) => handleFilterChange('department', value)}
        />
        
        <Select
          label="Risk Level"
          options={riskLevelOptions}
          value={filters?.riskLevel}
          onChange={(value) => handleFilterChange('riskLevel', value)}
        />
        
        <Select
          label="GPA Range"
          options={gpaRangeOptions}
          value={filters?.gpaRange}
          onChange={(value) => handleFilterChange('gpaRange', value)}
        />
        
        <Select
          label="Academic Year"
          options={academicYearOptions}
          value={filters?.academicYear}
          onChange={(value) => handleFilterChange('academicYear', value)}
        />
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-text-primary mb-3">Advanced Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Attendance Rate
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min %"
                  className="flex-1"
                  min="0"
                  max="100"
                />
                <span className="text-text-secondary">to</span>
                <Input
                  type="number"
                  placeholder="Max %"
                  className="flex-1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Assignment Completion
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min %"
                  className="flex-1"
                  min="0"
                  max="100"
                />
                <span className="text-text-secondary">to</span>
                <Input
                  type="number"
                  placeholder="Max %"
                  className="flex-1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Last Activity
              </label>
              <Select
                options={[
                  { value: '', label: 'Any time' },
                  { value: '1day', label: 'Last 24 hours' },
                  { value: '3days', label: 'Last 3 days' },
                  { value: '1week', label: 'Last week' },
                  { value: '1month', label: 'Last month' }
                ]}
                value=""
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      )}
      {/* Filter Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-text-secondary">
            Showing {totalStudents} students
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Save"
          >
            Save Filter Set
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => window.location?.reload()}
          >
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
};

const AnalyticsCharts = () => {
  const [activeChart, setActiveChart] = useState("performance");

  // Mock data for different charts
  const performanceData = [
    { department: "Computer Science", avgGPA: 3.4, students: 245 },
    { department: "Mathematics", avgGPA: 3.2, students: 189 },
    { department: "Physics", avgGPA: 3.1, students: 156 },
    { department: "Chemistry", avgGPA: 3.3, students: 134 },
    { department: "Biology", avgGPA: 3.5, students: 198 },
    { department: "Engineering", avgGPA: 3.2, students: 287 },
    { department: "Business", avgGPA: 3.0, students: 223 },
  ];

  const trendData = [
    { month: "Jan", avgGPA: 3.1, atRisk: 45 },
    { month: "Feb", avgGPA: 3.2, atRisk: 42 },
    { month: "Mar", avgGPA: 3.3, atRisk: 38 },
    { month: "Apr", avgGPA: 3.2, atRisk: 41 },
    { month: "May", avgGPA: 3.4, atRisk: 35 },
    { month: "Jun", avgGPA: 3.3, atRisk: 37 },
    { month: "Jul", avgGPA: 3.5, atRisk: 32 },
    { month: "Aug", avgGPA: 3.4, atRisk: 34 },
    { month: "Sep", avgGPA: 3.3, atRisk: 36 },
  ];

  const riskDistribution = [
    { name: "Low Risk", value: 68, color: "#10B981" },
    { name: "Medium Risk", value: 23, color: "#F59E0B" },
    { name: "High Risk", value: 9, color: "#EF4444" },
  ];

  const predictiveData = [
    { month: "Sep", actual: 3.3, predicted: 3.3 },
    { month: "Oct", actual: null, predicted: 3.4 },
    { month: "Nov", actual: null, predicted: 3.5 },
    { month: "Dec", actual: null, predicted: 3.4 },
    { month: "Jan", actual: null, predicted: 3.6 },
    { month: "Feb", actual: null, predicted: 3.5 },
  ];

  const chartConfigs = [
    { id: "performance", label: "Department Performance", icon: "BarChart3" },
    { id: "trends", label: "Performance Trends", icon: "TrendingUp" },
    { id: "risk", label: "Risk Distribution", icon: "PieChart" },
    { id: "predictions", label: "Predictive Analytics", icon: "Zap" },
  ];

  const renderChart = () => {
    switch (activeChart) {
      case "performance":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="department"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="avgGPA" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "trends":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={trendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="gpa" orientation="left" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="risk"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Line
                yAxisId="gpa"
                type="monotone"
                dataKey="avgGPA"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
              />
              <Line
                yAxisId="risk"
                type="monotone"
                dataKey="atRisk"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "risk":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Percentage"]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case "predictions":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={predictiveData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartDescription = () => {
    switch (activeChart) {
      case "performance":
        return "Average GPA performance across different departments with student enrollment numbers.";
      case "trends":
        return "Monthly trends showing average GPA progression and at-risk student counts over time.";
      case "risk":
        return "Distribution of students across different risk categories based on predictive analytics.";
      case "predictions":
        return "Machine learning predictions for future academic performance trends.";
      default:
        return "";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Analytics Dashboard
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {getChartDescription()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export Chart
          </Button>
          <Button variant="outline" size="sm" iconName="Settings">
            Configure
          </Button>
        </div>
      </div>
      {/* Chart Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-muted rounded-lg">
        {chartConfigs?.map((chart) => (
          <button
            key={chart?.id}
            onClick={() => setActiveChart(chart?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeChart === chart?.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-background"
            }`}
          >
            <Icon name={chart?.icon} size={16} />
            <span className="hidden sm:inline">{chart?.label}</span>
          </button>
        ))}
      </div>
      {/* Chart Container */}
      <div className="relative">{renderChart()}</div>
      {/* Chart Legend for Risk Distribution */}
      {activeChart === "risk" && (
        <div className="flex items-center justify-center space-x-6 mt-4">
          {riskDistribution?.map((item) => (
            <div key={item?.name} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item?.color }}
              />
              <span className="text-sm text-text-primary">{item?.name}</span>
              <span className="text-sm font-medium text-text-secondary">
                ({item?.value}%)
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Chart Insights */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-warning mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-1">
              Key Insights
            </h4>
            <div className="text-sm text-text-secondary space-y-1">
              {activeChart === "performance" && (
                <>
                  <p>
                    • Biology department shows the highest average GPA (3.5)
                  </p>
                  <p>
                    • Engineering has the largest student enrollment (287
                    students)
                  </p>
                  <p>
                    • Business department may need additional academic support
                  </p>
                </>
              )}
              {activeChart === "trends" && (
                <>
                  <p>
                    • Overall GPA trend shows improvement from January to July
                  </p>
                  <p>• At-risk student count decreased by 29% since January</p>
                  <p>• September shows slight decline, requiring attention</p>
                </>
              )}
              {activeChart === "risk" && (
                <>
                  <p>• 68% of students are in low-risk category</p>
                  <p>• Only 9% of students require immediate intervention</p>
                  <p>• Medium-risk students (23%) need monitoring</p>
                </>
              )}
              {activeChart === "predictions" && (
                <>
                  <p>• ML model predicts steady improvement through February</p>
                  <p>• Expected GPA increase of 0.3 points by January</p>
                  <p>
                    • Confidence interval: 85% accuracy based on historical data
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Mock admin user data
  const adminUser = {
    name: "Dr. Sarah Johnson",
    role: "admin",
    lastLogin: "2025-09-09 15:30",
  };

  const allStudents = [
    {
      id: "STU001",
      name: "Alex Thompson",
      studentId: "CS2024001",
      gpa: 3.8,
      trend: 5,
      riskLevel: "low",
      department: "Computer Science",
      lastActivity: "2 hours ago",
      email: "alex.thompson@university.edu",
      enrollmentDate: "2022-08-15",
    },
    {
      id: "STU002",
      name: "Maria Rodriguez",
      studentId: "MATH2024002",
      gpa: 3.2,
      trend: -2,
      riskLevel: "medium",
      department: "Mathematics",
      lastActivity: "1 day ago",
      email: "maria.rodriguez@university.edu",
      enrollmentDate: "2022-08-15",
    },
    {
      id: "STU003",
      name: "James Wilson",
      studentId: "PHY2024003",
      gpa: 2.8,
      trend: -8,
      riskLevel: "high",
      department: "Physics",
      lastActivity: "3 days ago",
      email: "james.wilson@university.edu",
      enrollmentDate: "2023-01-10",
    },
    {
      id: "STU004",
      name: "Emily Chen",
      studentId: "BIO2024004",
      gpa: 3.9,
      trend: 3,
      riskLevel: "low",
      department: "Biology",
      lastActivity: "1 hour ago",
      email: "emily.chen@university.edu",
      enrollmentDate: "2022-08-15",
    },
    {
      id: "STU005",
      name: "Michael Brown",
      studentId: "ENG2024005",
      gpa: 3.1,
      trend: 1,
      riskLevel: "medium",
      department: "Engineering",
      lastActivity: "4 hours ago",
      email: "michael.brown@university.edu",
      enrollmentDate: "2023-01-10",
    },
    {
      id: "STU006",
      name: "Sarah Davis",
      studentId: "CHEM2024006",
      gpa: 3.6,
      trend: 7,
      riskLevel: "low",
      department: "Chemistry",
      lastActivity: "30 minutes ago",
      email: "sarah.davis@university.edu",
      enrollmentDate: "2022-08-15",
    },
    {
      id: "STU007",
      name: "David Martinez",
      studentId: "BUS2024007",
      gpa: 2.9,
      trend: -5,
      riskLevel: "high",
      department: "Business",
      lastActivity: "2 days ago",
      email: "david.martinez@university.edu",
      enrollmentDate: "2023-08-15",
    },
    {
      id: "STU008",
      name: "Lisa Anderson",
      studentId: "CS2024008",
      gpa: 3.7,
      trend: 4,
      riskLevel: "low",
      department: "Computer Science",
      lastActivity: "1 hour ago",
      email: "lisa.anderson@university.edu",
      enrollmentDate: "2022-08-15",
    },
    {
      id: "STU009",
      name: "Robert Taylor",
      studentId: "MATH2024009",
      gpa: 2.7,
      trend: -10,
      riskLevel: "high",
      department: "Mathematics",
      lastActivity: "5 days ago",
      email: "robert.taylor@university.edu",
      enrollmentDate: "2023-01-10",
    },
    {
      id: "STU010",
      name: "Jennifer Lee",
      studentId: "PHY2024010",
      gpa: 3.4,
      trend: 2,
      riskLevel: "low",
      department: "Physics",
      lastActivity: "3 hours ago",
      email: "jennifer.lee@university.edu",
      enrollmentDate: "2022-08-15",
    },
  ];

  // Calculate metrics from student data
  const calculateMetrics = (students) => {
    const totalStudents = students?.length;
    const avgGPA = (
      students?.reduce((sum, student) => sum + student?.gpa, 0) / totalStudents
    )?.toFixed(2);
    const atRiskCount = students?.filter(
      (student) => student?.riskLevel === "high"
    )?.length;
    const improvingCount = students?.filter(
      (student) => student?.trend > 0
    )?.length;
    const improvingPercentage = (
      (improvingCount / totalStudents) *
      100
    )?.toFixed(0);

    return {
      totalStudents,
      avgGPA,
      atRiskCount,
      improvingPercentage,
    };
  };

  const metrics = calculateMetrics(
    filteredStudents?.length > 0 ? filteredStudents : allStudents
  );

  useEffect(() => {
    // Check authentication
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      navigate("/user-login");
      return;
    }

    // Initialize data
    setFilteredStudents(allStudents);

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/user-login");
  };

  const handleFilterChange = (filters) => {
    let filtered = [...allStudents];

    // Apply search filter
    if (filters?.searchTerm) {
      const searchTerm = filters?.searchTerm?.toLowerCase();
      filtered = filtered?.filter(
        (student) =>
          student?.name?.toLowerCase()?.includes(searchTerm) ||
          student?.studentId?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Apply department filter
    if (filters?.department) {
      filtered = filtered?.filter(
        (student) =>
          student?.department?.toLowerCase()?.replace(" ", "-") ===
          filters?.department
      );
    }

    // Apply risk level filter
    if (filters?.riskLevel) {
      filtered = filtered?.filter(
        (student) => student?.riskLevel === filters?.riskLevel
      );
    }

    // Apply GPA range filter
    if (filters?.gpaRange) {
      const [min, max] = filters?.gpaRange?.split("-")?.map(Number);
      filtered = filtered?.filter(
        (student) => student?.gpa >= min && student?.gpa <= max
      );
    }

    setFilteredStudents(filtered);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleBulkAction = (action, studentIds) => {
    console.log(`Performing ${action} on students:`, studentIds);
    // Implement bulk actions here
    switch (action) {
      case "export":
        // Export selected students data
        break;
      case "notify":
        // Send notifications to selected students
        break;
      case "intervention":
        // Schedule interventions for selected students
        break;
      default:
        break;
    }
  };

  const handleExportData = () => {
    console.log("Exporting all student data...");
    // Implement data export functionality
  };

  if (loading) {
    return (
      <LoadingStateManager type="fullpage" message="Loading Admin Dashboard" />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={adminUser} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Welcome back, {adminUser?.name}
              </h1>
              <p className="text-text-secondary mt-1">
                Monitor and analyze student performance across your institution
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-text-secondary">Last updated</p>
                <p className="text-sm font-medium text-text-primary">
                  {new Date()?.toLocaleString()}
                </p>
              </div>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <FilterControls
          onFilterChange={handleFilterChange}
          onExport={handleExportData}
          totalStudents={filteredStudents?.length}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Student Table - Takes 2/3 width on xl screens */}
          <div className="xl:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">
                    Student Performance Overview
                  </h2>
                  <p className="text-text-secondary mt-1">
                    Comprehensive view of all students with performance metrics
                    and risk indicators
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon
                    name="Filter"
                    size={16}
                    className="text-text-secondary"
                  />
                  <span className="text-sm text-text-secondary">
                    {filteredStudents?.length} of {allStudents?.length} students
                  </span>
                </div>
              </div>

              <StudentTable
                students={filteredStudents}
                onStudentSelect={handleStudentSelect}
                onBulkAction={handleBulkAction}
              />
            </div>
          </div>

          {/* Analytics Charts - Takes 1/3 width on xl screens */}
          <div className="xl:col-span-1">
            <AnalyticsCharts />
          </div>
        </div>

        
      </div>
      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={showStudentModal}
        onClose={() => {
          setShowStudentModal(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
};

export default AdminDashboard;