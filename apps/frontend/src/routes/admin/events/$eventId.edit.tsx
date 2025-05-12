import {
  createFileRoute,
  useNavigate,
  useParams,
  redirect,
} from "@tanstack/react-router";
import { baseApiClient, useApiClient } from "@/hooks/use-api-client";
import { EventForm, type EventFormData } from "@/components/admin/event-form"; // Adjust path
import { useState } from "react";

export const Route = createFileRoute("/admin/events/$eventId/edit")({
  beforeLoad: ({ context, location }) => {
    const auth = context.auth;
    if (!auth?.isAuthenticated || auth.user?.role !== "ADMIN") {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.href },
      });
    }
  },
  loader: async ({ params }) => {
    const { eventId } = params;
    const res = await baseApiClient.events[":id"].$get({
      param: { id: parseInt(eventId) },
    });
    console.log(res)

    if (!res.ok) {
      throw new Error(`Failed to load event for editing: ${res.status}`);
    }
    const eventData = await res.json();
    // Map to EventFormData, especially ensuring date is in YYYY-MM-DD
    return {
      ...eventData,
      date: eventData.date
        ? new Date(eventData.date).toISOString().split("T")[0]
        : "",
      price: Number(eventData.price) || 0,
    } as EventFormData;
  },
  component: EditEventPage,
});

function EditEventPage() {
  const navigate = useNavigate();
  const { eventId } = useParams({ from: "/admin/events/$eventId/edit" });
  const initialEventData = Route.useLoaderData();
  const getApiClient = useApiClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleUpdateEvent = async (data: EventFormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    const apiClient = getApiClient();

    try {
      const eventToUpdate = {
        ...data,
        price: Number(data.price),
      };

      const res = await apiClient.events[":id"].$put({
        param: { id: parseInt(eventId) },
        json: eventToUpdate,
      });

      if (!res.ok) {
        let errorMsg = "Failed to update event.";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          /* ignore */
        }
        throw new Error(errorMsg);
      }

      alert("Event updated successfully!");
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (error: any) {
      console.error("Failed to update event:", error);
      setSubmissionError(error.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  if (!initialEventData) {
    // This case should ideally be handled by the loader throwing an error,
    // which would render the route's errorComponent.
    return (
      <div className="container mx-auto py-8 px-4 text-danger">
        Event data could not be loaded.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <EventForm
        initialData={initialEventData}
        onSubmit={handleUpdateEvent}
        isSubmitting={isSubmitting}
        submitButtonText="Update Event"
        formTitle={`Edit Event: ${initialEventData.eventName || ""}`}
      />
    </div>
  );
}
