import {
  createFileRoute,
  Link,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { baseApiClient } from "@/hooks/use-api-client";
import { Card } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { DangerButton } from "@/components/danger-button";
import { useEffect } from "react";
import { router } from "@/main";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: ({ context, location }) => {
    const auth = context.auth;

    if (!auth?.isAuthenticated || !auth.user) {
      // Also check if auth.user exists
      throw redirect({
        // Use TanStack Router's redirect utility
        to: "/admin/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (auth.user.role !== "ADMIN") {
      console.warn("User is not an admin. Redirecting from admin dashboard.");
      throw redirect({ to: "/" });
    }
  },
  loader: async () => {
    // const auth = context.auth; // auth from context is available if needed for an authenticated API call
    // Ensure we have an API client that uses the admin's token.
    // The useApiClient hook is for components. For loaders, we might need a different approach
    // or ensure the baseApiClient can be configured with a token if necessary from context.
    // For now, assuming /events endpoint is readable by admin without specific loader-side auth client,
    // or that actions (create/update/delete) will use an authenticated client.
    // If GET /events requires ADMIN role, this should use an authenticated client.

    // If you have a way to get an auth-configured client in loader context, use it.
    // Otherwise, baseApiClient is used for non-authenticated or global context calls.
    const res = await baseApiClient.events.$get();
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch events for admin dashboard:", errorText);
      throw new Error(`Failed to load events: ${res.status} ${errorText}`);
    }
    const data = await res.json();
    // Ensure the loader returns an array of events.
    // Adjust `(data.events || data)` based on your actual API response structure.
    // If data is directly the array, use `data as DashboardEventType[]`.
    // If data is an object like { events: [...] }, use `data.events as DashboardEventType[]`.
    return data;
  },
  component: AdminDashboardComponent,
  errorComponent: AdminDashboardErrorComponent,
});

function AdminDashboardErrorComponent({}: { error: Error }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-grow items-center justify-center p-6">
      {/* Use flex-grow for centering in available space */}
      <Card className="text-center max-w-lg w-full p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-danger mb-4">
          Error Loading Dashboard
        </h2>
        {/* Matched text color to design system */}
        <PrimaryButton
          onClick={() => navigate({ to: Route.fullPath, replace: true })}
        >
          Try Again
        </PrimaryButton>
      </Card>
    </div>
  );
}

function AdminDashboardComponent() {
  const events = Route.useLoaderData();
  const navigate = useNavigate();
  const { isAuthenticated, user, apiClient } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleDelete = async (eventId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      const res = await apiClient.events[":id"].$delete({
        param: { id: eventId },
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Failed to delete event." }));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }
      alert("Event deleted successfully!");
      router.invalidate();
    } catch (error: any) {
      console.error("Failed to delete event:", error);
      alert(`Error deleting event: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center sm:text-left">
          Events Management
        </h1>
        <Link to="/admin/events/new" className="w-full sm:w-auto">
          <PrimaryButton className="text-base w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2 inline-block"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create New Event
          </PrimaryButton>
        </Link>
      </div>

      {Array.isArray(events) && events.length > 0 ? (
        <Card className="overflow-x-auto shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Using neutral gray for divider */}
            <thead className="bg-background">
              {/* Changed from bg-gray-50 */}
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
                >
                  Event Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
                >
                  Venue
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-muted uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              {/* Using neutral gray for divider */}
              {events.map((event) => (
                <tr
                  key={event.eventId}
                  className="hover:bg-background transition-colors duration-150" /* Use bg-background for hover for slight contrast */
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {/* Changed from text-gray-900 */}
                    {event.eventName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {/* Changed from text-gray-400 */}
                    {event.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {/* Changed from text-gray-400 */}
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {/* Changed from text-gray-400 */}
                    {event.venue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted text-right">
                    {/* Changed from text-gray-400 */}
                    {typeof event.price === "number"
                      ? `$${event.price.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                    <Link
                      to="/admin/events/$eventId/edit"
                      params={{ eventId: event.eventId.toString() }}
                    >
                      <SecondaryButton className="text-xs py-1 px-2 leading-tight">
                        Edit
                      </SecondaryButton>
                    </Link>
                    <DangerButton
                      onClick={() => handleDelete(event.eventId)}
                      className="text-xs py-1 px-2 leading-tight"
                    >
                      Delete
                    </DangerButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mx-auto h-16 w-16 text-muted mb-4" /* Changed from text-gray-400 */
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl text-gray-800 font-semibold mb-2">
            {/* Changed from text-gray-700 dark:text-gray-300 */}
            No events found.
          </p>
          <p className="text-muted mb-6">
            Get started by creating your first event.
          </p>
          <Link to="/admin/events/new">
            <PrimaryButton className="text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-2 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Create Event
            </PrimaryButton>
          </Link>
        </Card>
      )}
    </div>
  );
}
