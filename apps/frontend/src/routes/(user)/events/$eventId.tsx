import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { baseApiClient } from "@/lib/base-api-client";
import { router } from "@/main";
import { useAuth } from "@/lib/hooks/use-auth";
import { useState } from "react";
import { Card } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/(user)/events/$eventId")({
  loader: async ({ context, params }) => {
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

    const bookedEvents = new Set();

    if (context.auth && context.auth.user && context.auth.isAuthenticated) {
      const res = await context.auth.apiClient.bookings.$get();

      if (res.ok) {
        const booked = await res.json();
        booked.map((b) => {
          bookedEvents.add(b.booking.eventId);
        });
      }
    }

    return { event, bookedEvents };
  },
  component: EventDetailsComponent,
  errorComponent: EventDetailsErrorComponent,
});

function EventDetailsErrorComponent({ error }: { error: any }) {
  const { eventId } = Route.useParams();
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen flex flex-col items-center justify-center">
      <Card className="max-w-xl w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-danger mb-4">
          {t("errorPage.title")}
        </h1>
        <p className="text-base text-text mb-2">
          {t("errorPage.failedToLoadEvent", { eventId })}
        </p>
        <p className="text-sm text-muted mb-6">
          {error?.message || "An unknown error occurred."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/events"
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primaryDark transition duration-300 ease-in-out w-full sm:w-auto"
          >
            {t("errorPage.backButton", { item: "events" })}
          </Link>
          <SecondaryButton
            onClick={() => router.invalidate()}
            className="w-full sm:w-auto"
          >
            {t("errorPage.tryAgainButton")}
          </SecondaryButton>
        </div>
      </Card>
    </div>
  );
}

function EventDetailsComponent() {
  const { event, bookedEvents } = Route.useLoaderData();
  const { isAuthenticated, apiClient } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleBooking = async () => {
    setIsBooking(true);
    setBookingMessage(null);

    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: location.pathname } });
      setIsBooking(false);
      return;
    }

    try {
      const response = await apiClient.bookings.$post({
        json: { eventId: event.eventId },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      navigate({
        to: "/booking-success",
        search: {
          eventName: event.eventName,
          eventDate: event.date,
        },
        replace: true,
      });
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
            {t("eventDetails.backLink")}
          </Link>
        </div>

        <div className="bg-surface rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src={
                event.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  event.eventName,
                )}&background=random&size=1200x400&font-size=0.33`
              }
              alt={event.eventName}
              className="w-full h-64 md:h-96 object-cover"
            />
            {bookedEvents.has(event.eventId) && (
              <div className="absolute top-4 right-4 bg-success text-white text-sm font-semibold px-3 py-1 rounded-lg shadow-lg z-10">
                {t("events.bookedStatus")}
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
              {event.eventName}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-muted mb-2">
                  {t("eventDetails.descriptionTitle")}
                </h2>
                <p className="text-base text-text whitespace-pre-wrap">
                  {event.description || t("eventDetails.noDescription")}
                </p>
              </div>
              <div className="md:col-span-1 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("eventDetails.dateTimeTitle")}
                  </h3>
                  <p className="text-lg text-text">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("eventDetails.venueTitle")}
                  </h3>
                  <p className="text-lg text-text">{event.venue}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("eventDetails.categoryTitle")}
                  </h3>
                  <p className="text-lg text-text">{event.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("eventDetails.priceTitle")}
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

            {/* Warnings Section */}
            {event.availableTickets !== undefined && (
              <div className="mb-6">
                {event.availableTickets === 0 ? (
                  <p className="text-danger font-medium text-center">
                    {t("events.noTicketsAvailable")}
                  </p>
                ) : event.availableTickets < 10 ? (
                  <p className="text-warning font-medium text-center">
                    {t("events.hurryUpMessage", {
                      availableTickets: event.availableTickets,
                    })}
                  </p>
                ) : null}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-divider text-center">
              {bookedEvents.has(event.eventId) ? (
                <PrimaryButton
                  disabled
                  className="px-8 py-3 text-lg shadow-md bg-success hover:bg-green-600 disabled:bg-success disabled:hover:bg-success"
                >
                  {t("eventDetails.alreadyBookedButton")}
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  onClick={handleBooking}
                  disabled={isBooking || event.availableTickets === 0}
                  className="px-8 py-3 text-lg shadow-md hover:shadow-lg"
                >
                  {isBooking
                    ? t("eventDetails.bookingButtonLoading")
                    : t("eventDetails.bookButton")}
                </PrimaryButton>
              )}
              {bookingMessage && (
                <p
                  className={`mt-4 text-sm ${
                    bookingMessage.type === "success"
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {bookingMessage.text}
                </p>
              )}
              {!bookingMessage && !bookedEvents.has(event.eventId) && (
                <p className="text-sm text-muted mt-3">
                  {t("eventDetails.bookingCTA")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
