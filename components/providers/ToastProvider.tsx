'use client'

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#2a2a2a',
          color: '#fffbdf',
          border: '1px solid rgba(255, 251, 223, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        // Success toast
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#4ade80',
            secondary: '#2a2a2a',
          },
          style: {
            border: '1px solid rgba(74, 222, 128, 0.2)',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#f87171',
            secondary: '#2a2a2a',
          },
          style: {
            border: '1px solid rgba(248, 113, 113, 0.2)',
          },
        },
        // Loading toast
        loading: {
          iconTheme: {
            primary: '#fffbdf',
            secondary: '#2a2a2a',
          },
        },
      }}
    />
  );
}
