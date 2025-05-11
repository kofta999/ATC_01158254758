import React, { type ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
