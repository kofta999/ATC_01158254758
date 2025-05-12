import { createFileRoute, Link } from "@tanstack/react-router";
import { router } from "@/main";
import { Card } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";

export const Route = createFileRoute("/(user)/_protected/bookings")({
  loader: async ({ context }) => {
    try {
      const apiClient = context.auth?.apiClient;

      // Should not happen
      if (!apiClient) throw new Error("API Client not found");

      console.log(apiClient.auth)
      const res = await apiClient.bookings.$get();

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch bookings:", res.status, errorText);
        throw new Error(
          `Failed to load bookings: ${res.status} ${errorText || "Server error"}`,
        );
      }

      const bookings = await res.json();
      return bookings;
    } catch (error: any) {
      console.error("Error in bookings loader:", error);
      throw new Error(error.message || "Could not fetch bookings.");
    }
  },
  component: BookingsComponent,
  errorComponent: BookingsErrorComponent,
});

function BookingsErrorComponent({ error }: { error: Error }) {
  console.error("Rendering BookingsErrorComponent:", error); // Log the error being handled
  return (
    <div className="p-4 md:p-6 bg-background min-h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center">
      {/* Adjust min-h if header height is known */}
      <Card className="max-w-lg w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-danger mb-4">
          Oops! Something went wrong.
        </h1>
        <p className="text-base text-gray-800 mb-2">
          We couldn't load your bookings.
        </p>
        <p className="text-sm text-muted mb-6">
          Error: {error.message || "An unknown error occurred."}
        </p>
        <PrimaryButton
          onClick={() => {
            // Invalidate route data and retry loading
            router.invalidate();
            // router.load() might also be needed depending on TanStack Router version and setup
          }}
        >
          Try Again
        </PrimaryButton>
      </Card>
    </div>
  );
}

function BookingsComponent() {
  const bookings = Route.useLoaderData();

  return (
    <div className="bg-background min-h-[calc(100vh-var(--header-height))] p-4 md:p-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          My Bookings
        </h1>
        <p className="text-xl font-semibold text-muted">
          Your booked events and experiences
        </p>
      </header>

      {Array.isArray(bookings) && bookings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(
            (
              { booking, bookedEvent }, // Destructure here
            ) => (
              <Card
                key={booking.bookingId} // Use bookingId from nested object
                className="flex flex-col overflow-hidden"
              >
                <img
                  src={
                    bookedEvent.image || // Access image from bookedEvent
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(bookedEvent.eventName)}&background=random&size=400x200`
                  }
                  alt={bookedEvent.eventName} // Access eventName from bookedEvent
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <h2
                    className="text-xl font-semibold text-gray-800 mb-2 truncate"
                    title={bookedEvent.eventName} // Access eventName from bookedEvent
                  >
                    {bookedEvent.eventName}
                  </h2>
                  <p className="text-sm text-muted mb-1">
                    <span className="font-medium">Event Date:</span>{" "}
                    {new Date(bookedEvent.date).toLocaleDateString()}{" "}
                    {/* Access date from bookedEvent */}
                  </p>
                  <p className="text-sm text-muted mb-1">
                    <span className="font-medium">Venue:</span>{" "}
                    {bookedEvent.venue} {/* Access venue from bookedEvent */}
                  </p>
                  <p className="text-sm text-muted mb-3">
                    <span className="font-medium">Category:</span>{" "}
                    {bookedEvent.category}{" "}
                    {/* Access category from bookedEvent */}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    Booked on:{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}{" "}
                    {/* Access createdAt from booking */}
                  </p>
                  <div className="mt-auto pt-3 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">
                      ${bookedEvent.price.toFixed(2)}{" "}
                      {/* Access price from bookedEvent */}
                    </p>
                    <Link
                      to="/events/$eventId"
                      params={{ eventId: String(bookedEvent.eventId) }} // Access eventId from bookedEvent
                      className="text-sm text-primary hover:underline"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              </Card>
            ),
          )}
        </div>
      ) : (
        <Card className="text-center py-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-xl mt-4 font-semibold text-gray-800">
            You haven't booked any events yet.
          </p>
          <p className="text-base text-muted mb-6">
            Find an event you're interested in and book it!
          </p>
          <PrimaryButton onClick={() => router.navigate({ to: "/events" })}>
            Explore Events
          </PrimaryButton>
        </Card>
      )}
    </div>
  );
}
