import React, { type ButtonHTMLAttributes } from "react";

interface DangerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const DangerButton: React.FC<DangerButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-danger text-white hover:bg-red-700 transition duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
