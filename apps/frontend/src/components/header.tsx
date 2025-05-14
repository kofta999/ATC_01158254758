import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/hooks/use-auth";
import { PrimaryButton } from "./primary-button";
import { SecondaryButton } from "./secondary-button";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n"; // Import the i18n instance
import { useState } from "react";
import ThemeToggle from "./theme-toggle";

export const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === "en");

  const toggleLanguage = () => {
    const newLanguage = isEnglish ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    setIsEnglish(!isEnglish);
  };

  const handleLogout = async () => {
    await logout(true); // Pass true to redirect to login after logout
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-primary hover:text-primaryDark transition duration-300 ease-in-out"
        >
          {t("appTitle")}
        </Link>

        <ul className="flex items-center gap-3 sm:gap-4 text-sm">
          <li>
            <Link
              to="/events"
              className="text-muted hover:text-primary transition duration-300 ease-in-out px-2 py-1 sm:px-3 rounded-md"
              activeProps={{
                className: "!text-primary font-semibold bg-primary/10",
              }}
            >
              {t("navigation.events")}
            </Link>
          </li>
          {isAuthenticated && user && user.role === "USER" && (
            <li>
              <Link
                to="/bookings"
                className="text-muted hover:text-primary transition duration-300 ease-in-out px-2 py-1 sm:px-3 rounded-md"
                activeProps={{
                  className: "!text-primary font-semibold bg-primary/10",
                }}
              >
                {t("navigation.myBookings")}
              </Link>
            </li>
          )}
          {isAuthenticated && user && user.role === "ADMIN" && (
            <li>
              <Link
                to="/admin/dashboard"
                className="text-muted hover:text-primary transition duration-300 ease-in-out px-2 py-1 sm:px-3 rounded-md"
                activeProps={{
                  className: "!text-primary font-semibold bg-primary/10",
                }}
              >
                {t("navigation.dashboard")}
              </Link>
            </li>
          )}
          <li>
            {isAuthenticated ? (
              <SecondaryButton
                onClick={handleLogout}
                className="text-sm py-1.5 px-3"
              >
                {t("navigation.logout")}
              </SecondaryButton>
            ) : (
              <PrimaryButton
                onClick={() => navigate({ to: "/login" })}
                className="text-sm py-1.5 px-3"
              >
                {t("navigation.login")}
              </PrimaryButton>
            )}
          </li>
          <li>
            <button
              onClick={toggleLanguage}
              className="text-sm py-2 px-3 rounded-lg bg-surface border border-primary text-primary hover:bg-primary/10 transition duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEnglish ? "AR" : "EN"}
            </button>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};
