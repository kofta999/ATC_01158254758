import React, { useState, useEffect } from "react";

const ThemeToggle: React.FC = () => {
  // State to track the current mode, initialized from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof localStorage !== "undefined" && localStorage.theme) {
      return localStorage.theme === "dark";
    }
    // Default to system preference if no theme is set in localStorage
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  // Effect to apply the theme class to the html element
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
      // Add aria-label for accessibility
      html.setAttribute("data-theme", "dark");
    } else {
      html.classList.remove("dark");
      // Add aria-label for accessibility
      html.setAttribute("data-theme", "light");
    }
    // Save preference to localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]); // Rerun effect when isDarkMode changes

  // Handle button click to toggle theme
  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={handleToggle}
      className="text-sm py-2 px-2 rounded-lg bg-surface border border-primary text-primary hover:bg-primary/10 transition duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        // Moon icon for Dark Mode (indicates switching to light)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586"
          />
        </svg>
      ) : (
        // Sun icon for Light Mode (indicates switching to dark)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1m4 8a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-.464 4.95l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 1.414m2.12-10.607a1 1 0 0 1 0 1.414l-.706.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0M17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1M5.05 6.464A1 1 0 1 0 6.465 5.05l-.708-.707a1 1 0 0 0-1.414 1.414zm1.414 8.486l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414M4 11a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2z"
            clip-rule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
