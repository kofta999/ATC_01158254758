import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { EventForm } from "@/components/admin/event-form"; // Adjust path if needed
import { useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import type { InferRequestType } from "@repo/areeb-backend";
import type { baseApiClient } from "@/lib/base-api-client";

export type CreateEventFormData = InferRequestType<
  typeof baseApiClient.events.$post
>["form"];

export const Route = createFileRoute("/(admin)/admin/dashboard/events/new")({
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
  const { apiClient } = useAuth(); // Get token for authorization header
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_, setSubmissionError] = useState<string | null>(null); // Use submissionError state

  const handleCreateEvent = async (data: CreateEventFormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await apiClient.events.$post({ form: data });

      if (!response.ok) {
        let errorMsg = "Failed to create event.";

        throw new Error(errorMsg);
      }

      alert("Event created successfully!");
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (error: any) {
      console.error("Failed to create event:", error);
      setSubmissionError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <EventForm
        // @ts-expect-error Because file need to optional
        onSubmit={handleCreateEvent}
        isSubmitting={isSubmitting}
        submitButtonText="Create Event"
        formTitle="Create New Event"
        // submissionError={submissionError} // Pass error down
      />
    </div>
  );
}
