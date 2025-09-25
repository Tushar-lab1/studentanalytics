import React, { useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import AuthenticationHeader from '../components/ui/AuthenticationHeader';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import axios from 'axios';

const LoginFooter = () => {
  return (
    <div className="mt-8 space-y-6">
      {/* Forgot Password Link */}
      <div className="text-center">
        <button className="text-primary hover:text-primary/80 transition-colors duration-200 text-sm font-medium flex items-center space-x-1 mx-auto">
          <Icon name="Key" size={16} />
          <span>Forgot your password?</span>
        </button>
      </div>
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-text-secondary">
            New to StudentAnalytics?
          </span>
        </div>
      </div>
      {/* Register Link */}
      <div className="text-center">
        <Link
          to="/user-registration"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
        >
          <Icon name="UserPlus" size={18} />
          <span>Create your account</span>
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
      {/* Copyright */}
      <div className="text-center pt-4">
        <p className="text-xs text-text-secondary">
          © {new Date()?.getFullYear()} EduLens. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
  e?.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      email: formData.email,
      password: formData.password
    });

    const { user } = response.data;

    localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now()); // Can use real token later
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('loginTime', new Date().toISOString());

    if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/student-dashboard');
    }

  } catch (error) {
    console.error(error);
    const message = error.response?.data?.message || 'Login failed. Please try again.';
    setErrors({ general: message });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors duration-200"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* General Error Message */}
        {errors?.general && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} />
              <span>{errors?.general}</span>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          iconName={isLoading ? undefined : 'LogIn'}
          iconPosition="left"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <svg
            className="w-8 h-8 text-primary-foreground"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Welcome Back
      </h1>
      <p className="text-text-secondary text-lg mb-6">
        Sign in to access your educational analytics dashboard
      </p>

      {/* Security Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
        <Icon name="Shield" size={16} className="text-success" />
        <span className="text-sm font-medium text-success">Secure Login</span>
      </div>
    </div>
  );
};


const UserLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (authToken && userRole) {
      // Redirect to appropriate dashboard if already authenticated
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'student') {
        navigate('/student-dashboard');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <AuthenticationHeader showNavigation={true} />
      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
            {/* Login Header */}
            <LoginHeader />
            
            {/* Login Form */}
            <LoginForm />
            
            {/* Login Footer */}
            <LoginFooter />
          </div>
        </div>
      </div>
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default UserLogin;