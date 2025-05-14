export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-surface py-6 text-center border-t border-divider mt-auto">
      {/* Used bg-surface for a subtle distinction, border-divider is a common neutral */}
      <p className="text-sm text-muted">
        &copy; {currentYear} Evently. All rights reserved.
      </p>
    </footer>
  );
};
