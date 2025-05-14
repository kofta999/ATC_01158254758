import {
  createFileRoute,
  useNavigate,
  useParams,
  redirect,
} from "@tanstack/react-router";
import { EventForm } from "@/components/admin/event-form";
import { useState } from "react";
import { baseApiClient } from "@/lib/base-api-client";
import { useAuth } from "@/lib/hooks/use-auth";
import type { InferRequestType } from "@repo/areeb-backend";
import { useTranslation } from "react-i18next";

export type EditEventFormData = InferRequestType<
  (typeof baseApiClient.events)[":id"]["$put"]
>["form"];

export const Route = createFileRoute(
  "/(admin)/admin/dashboard/events/$eventId/edit",
)({
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
    };
  },
  component: EditEventPage,
});

function EditEventPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { eventId } = useParams({
    from: "/(admin)/admin/dashboard/events/$eventId/edit",
  });
  const initialEventData = Route.useLoaderData();
  const { apiClient } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_, setSubmissionError] = useState<string | null>(null);

  const handleUpdateEvent = async (data: EditEventFormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const eventToUpdate = {
        ...data,
        price: Number(data.price),
      };

      const res = await apiClient.events[":id"].$put({
        param: { id: parseInt(eventId) },
        form: eventToUpdate,
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
      alert(t("admin.deleteSuccess"));
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (error: any) {
      console.error("Failed to update event:", error);
      setSubmissionError(error.message || t("eventDetails.bookingErrorMessage"));
      setIsSubmitting(false);
    }
  };

  if (!initialEventData) {
    // This case should ideally be handled by the loader throwing an error,
    // which would render the route's errorComponent.
    return (
      <div className="container mx-auto py-8 px-4 text-danger">
        {t("admin.failedToLoadError")}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <EventForm
        initialData={initialEventData}
        onSubmit={handleUpdateEvent}
        isSubmitting={isSubmitting}
        submitButtonText={t("admin.updateEventButton")}
        formTitle={`${t("admin.editEventTitle")} ${initialEventData.eventName || ""}`}
      />
    </div>
  );
}
