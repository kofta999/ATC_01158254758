import { redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(user)/_protected")({
  beforeLoad: ({ context, location }) => {
    const auth = context.auth;
    console.log(auth)

    if (!auth?.isAuthenticated || !auth.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
