import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import React, { useEffect } from "react";
import { z } from "zod";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize"; // react-confetti often needs window size
import { router } from "@/main";
import { useTranslation } from "react-i18next";

// Define search params schema for type safety
// These parameters will be passed from the event details page after successful booking
const bookingSuccessSearchSchema = z.object({
  eventName: z.string().optional().default("Your Awesome Event"),
  eventDate: z.string().optional().default(new Date().toISOString()), // Expecting ISO string
  // You could add bookingId if available and useful to display
  // bookingId: z.string().optional(),
});

export const Route = createFileRoute("/(user)/_protected/booking-success")({
  validateSearch: bookingSuccessSearchSchema, // Validate and parse search params
  component: BookingSuccessComponent,
});

function BookingSuccessComponent() {
  const { eventName, eventDate } = Route.useSearch();
  const { t } = useTranslation();
  const { width, height } = useWindowSize(); // For react-confetti
  const [showConfetti, setShowConfetti] = React.useState(false);

  useEffect(() => {
    // Start confetti effect when component mounts
    setShowConfetti(true);
    // Optional: Stop confetti after a few seconds
    const timer = setTimeout(() => setShowConfetti(false), 7000); // Confetti for 7 seconds
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Safely format the date
  let formattedDate = "Not specified";
  if (eventDate) {
    try {
      formattedDate = new Date(eventDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.warn(
        "Invalid date format passed to booking success page:",
        eventDate,
      );
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false} // Set to true for continuous confetti
          numberOfPieces={250} // Adjust as needed
          gravity={0.1}
        />
      )}
      <Card className="max-w-lg w-full shadow-xl z-10">
        {" "}
        {/* z-10 to be above confetti if it's fullscreen */}
        <div className="p-6 md:p-8">
          <svg
            className="w-16 h-16 text-success mx-auto mb-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {t("bookingSuccess.title")}
          </h1>
          <p className="text-base text-muted mb-2">
            {t("bookingSuccess.subtitle")}
          </p>
          <p className="text-xl font-semibold text-primary mb-1">{eventName}</p>
          <p className="text-sm text-muted mb-6">{t("bookingSuccess.datePrefix")} {formattedDate}</p>

          <p className="text-sm text-gray-700 mb-6">
            {t("bookingSuccess.emailConfirmation")}
            You can also view your booking in your account.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <PrimaryButton
              onClick={() => router.navigate({ to: "/bookings" })}
              className="w-full sm:w-auto"
            >
              {t("bookingSuccess.viewBookingsButton")}
            </PrimaryButton>
            <SecondaryButton
              onClick={() => router.navigate({ to: "/events" })}
              className="w-full sm:w-auto"
            >
              {t("bookingSuccess.exploreEventsButton")}
            </SecondaryButton>
          </div>
        </div>
      </Card>
      <p className="text-xs text-muted mt-8 z-10">
        {t("bookingSuccess.thankYouMessage")}
      </p>
    </div>
  );
}
