import React, { type ButtonHTMLAttributes } from "react";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-surface border border-primary text-primary hover:bg-primary/10 transition duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:border-muted disabled:text-muted disabled:hover:bg-surface ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
