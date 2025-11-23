import { Suspense } from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-[#222222] rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-[#222222] rounded w-1/2"></div>
    </div>
  );
}

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingSkeleton />}>
      {children}
    </Suspense>
  );
}
