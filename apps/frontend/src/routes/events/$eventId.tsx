import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { baseApiClient, useApiClient } from "@/hooks/use-api-client";
import { router } from "@/main";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react"; // Import useEffect
import { Card } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";

export const Route = createFileRoute("/events/$eventId")({
  loader: async ({ params }) => {
    const { eventId } = params;
    const res = await baseApiClient.events[":id"].$get({
      param: { id: parseInt(eventId) },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch event ${eventId}:`, res.status, errorText);

      if (res.status === 404) {
        throw new Error(`Event with ID ${eventId} not found. ${errorText}`);
      }

      throw new Error(`Failed to load event ${eventId}: ${errorText}`);
    }

    const event = await res.json();
    return event;
  },
  component: EventDetailsComponent,
  errorComponent: EventDetailsErrorComponent,
});

function EventDetailsErrorComponent({ error }: { error: any }) {
  const { eventId } = Route.useParams();
  return (
    <div className="p-4 md:p-8 bg-background min-h-screen flex flex-col items-center justify-center">
      <Card className="max-w-xl w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-danger mb-4">
          Oops! Something Went Wrong
        </h1>
        <p className="text-base text-gray-800 mb-2">
          We couldn't load the details for event ID: {eventId}.
        </p>
        <p className="text-sm text-muted mb-6">
          {error?.message || "An unknown error occurred."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/events"
            // Using classes similar to PrimaryButton for this Link for now
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primaryDark transition duration-300 ease-in-out w-full sm:w-auto"
          >
            Back to Events
          </Link>
          <SecondaryButton
            onClick={() => router.invalidate()}
            className="w-full sm:w-auto"
          >
            Try Again
          </SecondaryButton>
        </div>
      </Card>
    </div>
  );
}

function EventDetailsComponent() {
  const event = Route.useLoaderData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const getApiClient = useApiClient();

  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  // Initialize isActuallyBooked with the loaded event's booking status
  const [isActuallyBooked, setIsActuallyBooked] = useState(event.isBooked);

  // Effect to update isActuallyBooked if the event data from loader changes
  // (e.g., due to router.invalidate() and re-fetch)
  useEffect(() => {
    setIsActuallyBooked(event.isBooked);
  }, [event.isBooked]);

  const handleBooking = async () => {
    if (isActuallyBooked) return; // Prevent booking if already booked

    setIsBooking(true);
    setBookingMessage(null);

    if (!isAuthenticated) {
      // Preserve current path for redirect after login
      navigate({ to: "/login", search: { redirect: Route.fullPath } });
      setIsBooking(false);
      return;
    }

    try {
      const apiClient = getApiClient();
      const response = await apiClient.bookings.$post({
        json: { eventId: event.eventId },
      });

      if (!response.ok) {
        let errorText = `Server error: ${response.status}`;
        try {
          // Attempt to parse backend error message
          const errorData = await response.json();
          // @ts-expect-error - Assuming errorData might have a 'message' property
          errorText = errorData.message || errorText;
        } catch (e) {
          // If JSON parsing fails, use the generic errorText
          console.warn("Could not parse error response JSON:", e);
        }
        throw new Error(errorText);
      }

      setBookingMessage({
        type: "success",
        text: "Event booked successfully!",
      });
      setIsActuallyBooked(true); // Optimistically update UI
      // Consider invalidating only if necessary, to allow optimistic UI to shine
      // router.invalidate(); // This would re-fetch loader data
    } catch (error: any) {
      console.error("Booking failed:", error);
      setBookingMessage({
        type: "error",
        text: error.message || "An unexpected error occurred during booking.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/events" className="text-primary hover:underline text-sm">
            &larr; Back to All Events
          </Link>
        </div>

        <div className="bg-surface rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src={
                event.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(event.eventName)}&background=random&size=1200x400&font-size=0.33`
              }
              alt={event.eventName}
              className="w-full h-64 md:h-96 object-cover"
            />
            {isActuallyBooked && (
              <div className="absolute top-4 right-4 bg-success text-white text-sm font-semibold px-3 py-1 rounded-lg shadow-lg z-10">
                ✓ Booked
              </div>
            )}
          </div>
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {event.eventName}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-muted mb-2">
                  Event Description
                </h2>
                <p className="text-base text-gray-800 whitespace-pre-wrap">
                  {event.description || "No description provided."}
                </p>
              </div>
              <div className="md:col-span-1 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </h3>
                  <p className="text-lg text-gray-800">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {/* Consider adding time if available in event.date or a separate field */}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Venue
                  </h3>
                  <p className="text-lg text-gray-800">{event.venue}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </h3>
                  <p className="text-lg text-gray-800">{event.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    $
                    {typeof event.price === "number"
                      ? event.price.toFixed(2)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              {isActuallyBooked ? (
                <PrimaryButton
                  disabled
                  className="px-8 py-3 text-lg shadow-md bg-success hover:bg-green-600 disabled:bg-success disabled:hover:bg-success"
                >
                  Already Booked
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="px-8 py-3 text-lg shadow-md hover:shadow-lg"
                >
                  {isBooking ? "Booking..." : "Book This Event"}
                </PrimaryButton>
              )}
              {bookingMessage && (
                <p
                  className={`mt-4 text-sm ${bookingMessage.type === "success" ? "text-success" : "text-danger"}`}
                >
                  {bookingMessage.text}
                </p>
              )}
              {!bookingMessage && !isActuallyBooked && (
                <p className="text-sm text-muted mt-3">
                  Secure your spot now! Limited availability.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
