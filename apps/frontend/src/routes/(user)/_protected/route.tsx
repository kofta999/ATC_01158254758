import { redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(user)/_protected")({
  beforeLoad: ({ location }) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});
