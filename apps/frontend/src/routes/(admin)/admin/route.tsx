import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(admin)/admin")({
  beforeLoad: ({ context }) => {
    const auth = context.auth;

    if (auth && auth.user && auth?.user?.role !== "ADMIN") {
      console.warn("User is not an admin. Redirecting from admin dashboard.");
      throw redirect({ to: "/" });
    }
  },
});
