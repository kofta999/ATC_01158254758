import React, { type ButtonHTMLAttributes } from "react";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="px-4 py-2 rounded-lg bg-white border border-primary text-primary hover:bg-primary/10 transition duration-300"
      {...props}
    >
      {children}
    </button>
  );
};
