import React from 'react';
import AuthenticationHeader from '../components/ui/AuthenticationHeader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';
import axios from 'axios';

const RegistrationHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <svg
            className="w-7 h-7 text-primary-foreground"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-text-primary">EduLens</h1>
          <p className="text-sm text-text-secondary">Empowering Educational Excellence</p>
        </div>
      </div>
    </div>
  );
};


const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for testing
  const mockCredentials = {
    student: {
      email: 'student@example.com',
      password: 'Student123!'
    },
    admin: {
      email: 'admin@example.com',
      password: 'Admin123!'
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex?.test(formData?.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));

    // Clear role error when selected
    if (errors?.role) {
      setErrors(prev => ({
        ...prev,
        role: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
  e?.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setIsLoading(true);

  try {
    // Make actual API call to backend
    const response = await axios.post('http://localhost:5000/api/register', {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    const { user } = response.data;

    // Store authToken and user data in localStorage
    localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now()); // In real implementation, the token comes from backend
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userData', JSON.stringify(user));

    // Redirect based on role
    if (user.role === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/admin-dashboard');
    }

  } catch (error) {
    console.error(error);
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    setErrors({ submit: errorMessage });
  } finally {
    setIsLoading(false);
  }
};
  

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name Input */}
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
          className="w-full"
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          className="w-full"
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a strong password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          description="Must contain uppercase, lowercase, number, and special character"
          required
          className="w-full"
        />

        {/* Confirm Password Input */}
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
          className="w-full"
        />

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">
            Select Your Role <span className="text-error">*</span>
          </label>
          
          <div className="space-y-3">
            {/* Student Role */}
            <div
              onClick={() => handleRoleChange('student')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                formData?.role === 'student' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData?.role === 'student' ?'border-primary bg-primary' :'border-border'
                  }`}>
                    {formData?.role === 'student' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Icon name="GraduationCap" size={20} className="text-primary" />
                    <h3 className="font-medium text-text-primary">Student</h3>
                  </div>
                  {/* <p className="text-sm text-text-secondary mt-1">
                    Access your personal performance metrics, track academic progress, and view predictive insights for your educational journey.
                  </p> */}
                </div>
              </div>
            </div>

            {/* Administrator Role */}
            <div
              onClick={() => handleRoleChange('admin')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                formData?.role === 'admin' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData?.role === 'admin' ?'border-primary bg-primary' :'border-border'
                  }`}>
                    {formData?.role === 'admin' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={20} className="text-primary" />
                    <h3 className="font-medium text-text-primary">Administrator</h3>
                  </div>
                  {/* <p className="text-sm text-text-secondary mt-1">
                    Comprehensive oversight of all student performance data, analytics dashboard, and institutional insights for educational decision-making.
                  </p> */}
                </div>
              </div>
            </div>
          </div>

          {errors?.role && (
            <p className="text-sm text-error mt-1">{errors?.role}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors?.submit && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error">{errors?.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/user-login')}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

const UserRegistration = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthenticationHeader showNavigation={true} />
      {/* Main Content */}

        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            <RegistrationHeader />
            <RegistrationForm />
          </div>
      </div>
      {/* Footer */}
      <footer className="bg-surface border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-text-secondary">
              © {new Date()?.getFullYear()} EduLens. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserRegistration;