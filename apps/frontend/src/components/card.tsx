import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-surface rounded-2xl shadow-md p-4 md:p-6 ${className}`}>
      {children}
    </div>
  );
};
