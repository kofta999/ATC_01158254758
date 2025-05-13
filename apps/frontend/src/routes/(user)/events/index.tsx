import { createFileRoute, Link } from "@tanstack/react-router";
import { router } from "@/main";
import { Card } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";
import { baseApiClient } from "@/lib/base-api-client";

export const Route = createFileRoute("/(user)/events/")({
  loader: async () => {
    const res = await baseApiClient.events.$get();
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch events:", res.status, errorText);
      throw new Error(`Failed to load events: ${res.status} ${errorText}`);
    }
    const events = await res.json(); // Type will be inferred if baseApiClient is strongly typed
    return events;
  },
  component: EventsComponent,
  errorComponent: EventsErrorComponent,
});

function EventsErrorComponent({ error }: { error: Error }) {
  return (
    <div className="p-4 md:p-6 bg-background min-h-screen flex flex-col items-center justify-center">
      <Card className="max-w-lg w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-danger mb-4">
          Oops! Something went wrong.
        </h1>
        <p className="text-base text-gray-800 mb-2">
          We couldn't load the events.
        </p>
        <p className="text-sm text-muted mb-6">
          {error.message || "An unknown error occurred."}
        </p>
        <PrimaryButton
          onClick={() => {
            router.invalidate();
            // Optionally navigate to try reloading the current route,
            // though invalidate should trigger loader.
            // If it was a navigation error, navigate might be needed.
            // For now, invalidate is likely sufficient.
          }}
        >
          Try Again
        </PrimaryButton>
      </Card>
    </div>
  );
}

function EventsComponent() {
  const events = Route.useLoaderData(); // `events` will have the inferred type from the loader

  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Upcoming Events
        </h1>
        <p className="text-xl font-semibold text-muted">
          Discover and book your next experience
        </p>
      </header>

      {/* Ensure events is an array and has items before mapping */}
      {Array.isArray(events) && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <Link
              key={event.eventId}
              to="/events/$eventId"
              params={{ eventId: String(event.eventId) }}
              className="relative bg-surface rounded-2xl shadow-md overflow-hidden flex flex-col transition duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              {event.isBooked && (
                <span className="absolute top-2 right-2 bg-success text-white text-xs font-semibold px-2 py-1 rounded-full z-10 shadow">
                  Booked
                </span>
              )}
              <img
                src={
                  event.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(event.eventName)}&background=random&size=400x200`
                }
                alt={event.eventName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 md:p-6 flex flex-col flex-grow">
                <h2
                  className="text-xl font-semibold text-gray-800 mb-2 truncate"
                  title={event.eventName}
                >
                  {event.eventName}
                </h2>
                <p className="text-sm text-muted mb-1">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted mb-1">
                  <span className="font-medium">Venue:</span> {event.venue}
                </p>
                <p className="text-sm text-muted mb-3">
                  <span className="font-medium">Category:</span>{" "}
                  {event.category}
                </p>
                <div className="mt-auto pt-3 border-t border-gray-200">
                  <p className="text-lg font-bold text-primary text-right">
                    $
                    {typeof event.price === "number"
                      ? event.price.toFixed(2)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center py-10">
          {/* Adjusted padding as Card has its own */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl mt-4 font-semibold text-gray-800">
            No events found at the moment.
          </p>
          <p className="text-base text-muted">
            Please check back later for new and exciting events!
          </p>
        </Card>
      )}
    </div>
  );
}
