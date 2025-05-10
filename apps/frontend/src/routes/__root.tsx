import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <RootLayout />
      <TanStackRouterDevtools />
    </>
  ),
});

export default function RootLayout() {
  return (
    <div className="font-display bg-background min-h-screen">
      <meta name="description" content="An internet website!" />
      <link rel="icon" type="image/png" href="/images/favicon.png" />
      <main className="flex items-center justify-center min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
