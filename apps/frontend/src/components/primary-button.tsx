import React, { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition duration-300"
      {...props}
    >
      {children}
    </button>
  );
};
