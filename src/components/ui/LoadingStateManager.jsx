import React from 'react';


const LoadingStateManager = ({ 
  type = 'default', 
  message = 'Loading...', 
  size = 'default',
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Spinner Component
  const Spinner = ({ size: spinnerSize = 'default' }) => (
    <div className={`${sizeClasses?.[spinnerSize]} animate-spin`}>
      <svg
        className="w-full h-full text-primary"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  // Skeleton Component for data loading
  const Skeleton = ({ className: skeletonClassName = '' }) => (
    <div className={`animate-pulse bg-muted rounded ${skeletonClassName}`} />
  );

  // Chart Loading Component
  const ChartLoading = () => (
    <div className="w-full h-64 bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-3">
        <div className="flex items-end space-x-2 h-32">
          {[...Array(7)]?.map((_, i) => (
            <Skeleton 
              key={i} 
              className={`flex-1 ${
                i === 0 ? 'h-16' : 
                i === 1 ? 'h-24' : 
                i === 2 ? 'h-20' : 
                i === 3 ? 'h-32' : 
                i === 4 ? 'h-12' : 
                i === 5 ? 'h-28' : 'h-18'
              }`} 
            />
          ))}
        </div>
        <div className="flex justify-between">
          {[...Array(7)]?.map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </div>
  );

  // Dashboard Card Loading
  const CardLoading = () => (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );

  // Authentication Loading
  const AuthLoading = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Spinner size={size} />
      <div className="text-center">
        <p className={`${textSizeClasses?.[size]} font-medium text-text-primary`}>
          {message}
        </p>
        <p className="text-sm text-text-secondary mt-1">
          Please wait while we verify your credentials...
        </p>
      </div>
    </div>
  );

  // Full Page Loading
  const FullPageLoading = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size="xl" />
        <div>
          <p className="text-xl font-medium text-text-primary">{message}</p>
          <p className="text-text-secondary mt-2">
            Setting up your dashboard...
          </p>
        </div>
      </div>
    </div>
  );

  // Inline Loading
  const InlineLoading = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Spinner size={size} />
      <span className={`${textSizeClasses?.[size]} text-text-secondary`}>
        {message}
      </span>
    </div>
  );

  // Button Loading
  const ButtonLoading = () => (
    <div className="flex items-center space-x-2">
      <Spinner size="sm" />
      <span>{message}</span>
    </div>
  );

  // Overlay Loading
  const OverlayLoading = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <div>
            <p className="text-lg font-medium text-text-primary">{message}</p>
            <p className="text-sm text-text-secondary mt-1">
              This may take a few moments...
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on type
  switch (type) {
    case 'auth':
      return <AuthLoading />;
    case 'fullpage':
      return <FullPageLoading />;
    case 'chart':
      return <ChartLoading />;
    case 'card':
      return <CardLoading />;
    case 'button':
      return <ButtonLoading />;
    case 'skeleton':
      return <Skeleton className={className} />;
    case 'overlay':
      return <OverlayLoading />;
    case 'inline':
      return <InlineLoading />;
    default:
      if (overlay) {
        return <OverlayLoading />;
      }
      return <InlineLoading />;
  }
};

// Export individual components for specific use cases
export const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses?.[size]} animate-spin ${className}`}>
      <svg
        className="w-full h-full text-primary"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const LoadingSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

export default LoadingStateManager;