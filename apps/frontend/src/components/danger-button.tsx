import React, { type ButtonHTMLAttributes } from "react";

interface DangerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const DangerButton: React.FC<DangerButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="px-4 py-2 rounded-lg bg-danger text-white hover:bg-red-700 transition duration-300"
      {...props}
    >
      {children}
    </button>
  );
};
