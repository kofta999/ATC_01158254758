import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useApiClient } from "@/hooks/use-api-client";
import { EventForm, type EventFormData } from "@/components/admin/event-form"; // Adjust path if needed
import { useState } from "react";
// Assuming CreateEventSchema is similar to EventFormData or can be mapped
// import type { CreateEventSchema } from "@repo/areeb-backend/src/common/dtos/create-event.dto";

export const Route = createFileRoute("/admin/events/new")({
  beforeLoad: ({ context, location }) => {
    const auth = context.auth;
    if (!auth?.isAuthenticated || auth.user?.role !== "ADMIN") {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.href },
      });
    }
  },
  component: CreateEventPage,
});

function CreateEventPage() {
  const navigate = useNavigate();
  const getApiClient = useApiClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleCreateEvent = async (data: EventFormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    const apiClient = getApiClient();

    try {
      // Ensure data sent matches the backend's CreateEventSchema
      // This might involve mapping EventFormData if it differs.
      // For Hono/hc, the json body should match the input schema of the route.
      const eventToCreate = {
        ...data,
        price: Number(data.price), // Ensure price is a number
      };

      const res = await apiClient.events.$post({ json: eventToCreate });

      if (!res.ok) {
        let errorMsg = "Failed to create event.";
        throw new Error(errorMsg);
      }

      // const newEvent = await res.json(); // Contains the created event
      alert("Event created successfully!"); // Or use a more sophisticated notification
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (error: any) {
      console.error("Failed to create event:", error);
      setSubmissionError(error.message || "An unexpected error occurred.");
      setIsSubmitting(false); // Allow user to try again
    }
    // No finally here, setIsSubmitting is handled in error or on navigation
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* submissionError is now handled by the EventForm component itself */}
      <EventForm
        onSubmit={handleCreateEvent}
        isSubmitting={isSubmitting}
        submitButtonText="Create Event"
        formTitle="Create New Event"
      />
    </div>
  );
}
