import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { router } from "@/main";
import { Card } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";
import { DangerButton } from "@/components/danger-button"; // Import DangerButton
import { useAuth } from "@/lib/hooks/use-auth"; // Import useAuth to access apiClient
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export const Route = createFileRoute("/(user)/_protected/bookings")({
  loader: async ({ context }) => {
    try {
      const apiClient = context.auth?.apiClient;

      // Should not happen
      if (!apiClient) throw new Error("API Client not found");

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
  const { t } = useTranslation();
  console.error("Rendering BookingsErrorComponent:", error);
  return (
    <div className="p-4 md:p-6 bg-background min-h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center">
      <Card className="max-w-lg w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-danger mb-4">
          {t("errorPage.title")}
        </h1>
        <p className="text-base text-text mb-2">
          {t("errorPage.genericLoadError", { item: "bookings" })}
        </p>
        <p className="text-sm text-muted mb-6">
          Error: {error.message || "An unknown error occurred."}
        </p>
        <PrimaryButton onClick={() => router.invalidate()}>
          {t("errorPage.tryAgainButton")}
        </PrimaryButton>
      </Card>
    </div>
  );
}

function BookingsComponent() {
  const bookings = Route.useLoaderData();
  const { apiClient } = useAuth();
  const { t, i18n } = useTranslation();
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm(t("myBookings.cancelConfirmation"))) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await apiClient.bookings[":id"].$delete({
        param: { id: bookingId }, // Pass bookingId as a string param
      });

      if (!res.ok) {
        let errorMsg = `Failed to cancel booking (status: ${res.status}).`;
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          /* Ignore if response is not JSON */
        }
        throw new Error(errorMsg);
      }

      alert(t("myBookings.cancelSuccess")); // Simple feedback
      await router.invalidate();
    } catch (error: any) {
      console.error("Failed to cancel booking:", error);
      alert(
        t("myBookings.cancelError", {
          message: error.message || "Unknown error",
        }),
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="bg-background min-h-[calc(100vh-var(--header-height))] p-4 md:p-8">
      <header
        className={clsx(
          "mb-8 text-center",
          i18n.language == "ar" ? "md:text-right" : "md:text-left",
        )}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-text">
          {t("myBookings.pageTitle")}
        </h1>
        <p className="text-xl font-semibold text-muted">
          {t("myBookings.pageSubtitle")}
        </p>
      </header>

      {Array.isArray(bookings) && bookings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(({ booking, bookedEvent }) => {
            const isCancelling = cancellingId === booking.bookingId; // Check if this card's cancel is loading
            return (
              <Card
                key={booking.bookingId}
                className="flex flex-col overflow-hidden"
              >
                <img
                  src={
                    bookedEvent.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(bookedEvent.eventName)}&background=random&size=400x200`
                  }
                  alt={bookedEvent.eventName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <h2
                    className="text-xl font-semibold text-text mb-2 truncate"
                    title={bookedEvent.eventName}
                  >
                    {bookedEvent.eventName}
                  </h2>
                  {/* ... other event details ... */}
                  <p className="text-sm text-muted mb-1">
                    <span className="font-medium">
                      {t("myBookings.eventDatePrefix")}:
                    </span>{" "}
                    {new Date(bookedEvent.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted mb-1">
                    <span className="font-medium">
                      {t("myBookings.venuePrefix")}:
                    </span>{" "}
                    {bookedEvent.venue}
                  </p>
                  <p className="text-sm text-muted mb-3">
                    <span className="font-medium">
                      {t("myBookings.categoryPrefix")}:
                    </span>{" "}
                    {bookedEvent.category}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    {t("myBookings.bookedOnPrefix")}:{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-auto pt-3 border-t border-divider flex justify-between items-center gap-2">
                    {/* Price */}
                    <p className="text-lg font-bold text-primary">
                      ${bookedEvent.price.toFixed(2)}
                    </p>
                    {/* Action Buttons */}
                    <div className="flex gap-2 items-center">
                      <Link
                        to="/events/$eventId"
                        params={{ eventId: String(bookedEvent.eventId) }}
                        className="text-sm text-primary hover:underline whitespace-nowrap px-3 py-1 rounded hover:bg-primary/10 transition-colors"
                        aria-label={`View details for ${bookedEvent.eventName}`}
                      >
                        {t("myBookings.viewEventButton")}
                      </Link>
                      <DangerButton
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        disabled={isCancelling}
                        className="text-sm px-3 py-1" // Smaller padding
                        aria-label={`Cancel booking for ${bookedEvent.eventName}`}
                      >
                        {isCancelling
                          ? t("myBookings.cancellingButton")
                          : t("myBookings.cancelButton")}
                      </DangerButton>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        // "No bookings yet" message remains the same
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
          <p className="text-xl mt-4 font-semibold text-text">
            {t("myBookings.noBookingsTitle")}
          </p>
          <p className="text-base text-muted mb-6">
            {t("myBookings.noBookingsMessage")}
          </p>
          <PrimaryButton onClick={() => router.navigate({ to: "/events" })}>
            {t("myBookings.exploreEventsButton")}
          </PrimaryButton>
        </Card>
      )}
    </div>
  );
}
