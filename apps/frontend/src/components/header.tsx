import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { PrimaryButton } from "./primary-button";
import { SecondaryButton } from "./secondary-button";

export const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
          Evently
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
              Events
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link
                // TODO: Add correct link
                to="/bookings"
                className="text-muted hover:text-primary transition duration-300 ease-in-out px-2 py-1 sm:px-3 rounded-md"
                activeProps={{
                  className: "!text-primary font-semibold bg-primary/10",
                }}
              >
                My Bookings
              </Link>
            </li>
          )}
          <li>
            {isAuthenticated ? (
              <SecondaryButton
                onClick={handleLogout}
                className="text-sm py-1.5 px-3"
              >
                Logout
              </SecondaryButton>
            ) : (
              <PrimaryButton
                onClick={() => navigate({ to: "/login" })}
                className="text-sm py-1.5 px-3"
              >
                Login
              </PrimaryButton>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};
