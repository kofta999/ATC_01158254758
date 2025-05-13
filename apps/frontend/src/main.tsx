import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, useEffect } from "react"; // Import React and useEffect
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { useAuth, AuthProvider } from "@/lib/hooks/use-auth.tsx";

// Update AuthContextType in use-auth.tsx to include the user
// For now, let's assume AuthContextType might look like this for the router:
// We will effectively use AuthContextType directly and expect it to be updated in use-auth.tsx
// to include the `user` property.

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Create a component to wrap RouterProvider and update router context
function App() {
  const auth = useAuth(); // This hook now works because AuthProvider is a parent

  useEffect(() => {
    // Update the router context whenever auth state changes
    // Make sure the `auth` object from `useAuth` includes all necessary fields like `user`
    router.update({
      context: {
        ...router.options.context,
        auth,
      },
    });
  }, [auth]); // Dependency array ensures this runs when auth object changes

  return <RouterProvider router={router} />;
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
