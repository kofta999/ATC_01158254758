import {
  createFileRoute,
  Link,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { Card } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { DangerButton } from "@/components/danger-button";
import { useEffect, useState } from "react";
import { baseApiClient } from "@/lib/base-api-client";
import { useAuth } from "@/lib/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { CategoryFilter } from "@/components/category-filter";
import { z } from "zod";
import { eventCategories } from "@repo/areeb-backend/consts/event-categories";
import { router } from "@/main";
import { clsx } from "clsx";

export const Route = createFileRoute("/(admin)/admin/dashboard/")({
  beforeLoad: ({ context, location }) => {
    const auth = context.auth;

    if (!auth?.isAuthenticated || !auth.user) {
      throw redirect({
        to: "/admin/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (auth.user.role !== "ADMIN") {
      console.warn("User is not an admin. Redirecting from admin dashboard.");
      throw redirect({ to: "/" });
    }
  },
  validateSearch: z.object({
    category: z.enum(eventCategories).optional().catch(undefined),
  }),
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: async ({ deps: { category } }) => {
    const res = await baseApiClient.events.$get({ query: { category } });
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch events for admin dashboard:", errorText);
      throw new Error(`Failed to load events: ${res.status} ${errorText}`);
    }
    return res.json();
  },
  component: AdminDashboardComponent,
  errorComponent: AdminDashboardErrorComponent,
});

function AdminDashboardErrorComponent({}: { error: Error }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="flex flex-grow items-center justify-center p-6">
      <Card className="text-center max-w-lg w-full p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-danger mb-4">
          {t("errorPage.title")}
        </h2>
        <PrimaryButton
          onClick={() => navigate({ to: Route.fullPath, replace: true })}
        >
          {t("errorPage.tryAgainButton")}
        </PrimaryButton>
      </Card>
    </div>
  );
}

function AdminDashboardComponent() {
  const events = Route.useLoaderData();
  const navigate = useNavigate();
  const { isAuthenticated, user, apiClient } = useAuth();
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleDelete = async (eventId: number) => {
    if (!window.confirm(t("admin.deleteConfirmation"))) {
      return;
    }
    try {
      const res = await apiClient.events[":id"].$delete({
        param: { id: eventId },
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Failed to delete event." }));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }
      alert(t("admin.deleteSuccess"));
      await router.invalidate();
    } catch (error: any) {
      console.error("Failed to delete event:", error);
      alert(t("admin.deleteError", { message: error.message }));
    }
  };

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    router.navigate({
      to: "/admin/dashboard",
      search: (old) => ({ ...old, category: category || undefined }),
      replace: true,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-text text-center sm:text-left">
          {t("admin.dashboardTitle")}
        </h1>
        <Link to="/admin/dashboard/events/new" className="w-full sm:w-auto">
          <PrimaryButton className="text-base w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2 inline-block"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            {t("admin.createNewEventButton")}
          </PrimaryButton>
        </Link>
      </div>

      <div className="max-w-md mb-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {Array.isArray(events) && events.length > 0 ? (
        <Card className="overflow-x-auto shadow-lg">
          <table className="min-w-full divide-y divide-divider">
            <thead className="bg-background">
              <tr>
                <th
                  scope="col"
                  className={clsx(
                    "px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider",
                    i18n.language === "ar" ? "text-right" : "text-left",
                  )}
                >
                  {t("admin.tableHeaders.eventName")}
                </th>
                <th
                  scope="col"
                  className={clsx(
                    "px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider",
                    i18n.language === "ar" ? "text-right" : "text-left",
                  )}
                >
                  {t("admin.tableHeaders.category")}
                </th>
                <th
                  scope="col"
                  className={clsx(
                    "px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider",
                    i18n.language === "ar" ? "text-right" : "text-left",
                  )}
                >
                  {t("admin.tableHeaders.date")}
                </th>
                <th
                  scope="col"
                  className={clsx(
                    "px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider",
                    i18n.language === "ar" ? "text-right" : "text-left",
                  )}
                >
                  {t("admin.tableHeaders.venue")}
                </th>
                <th
                  scope="col"
                  className={clsx(
                    "px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider",
                    i18n.language === "ar" ? "text-right" : "text-left",
                  )}
                >
                  {t("admin.tableHeaders.price")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-muted uppercase tracking-wider"
                >
                  {t("admin.tableHeaders.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-divider">
              {events.map((event) => (
                <tr
                  key={event.eventId}
                  className="hover:bg-background transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                    {event.eventName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {event.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {event.venue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted text-right">
                    {typeof event.price === "number"
                      ? `$${event.price.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                    <Link
                      to="/admin/dashboard/events/$eventId/edit"
                      params={{ eventId: event.eventId.toString() }}
                    >
                      <SecondaryButton className="text-xs py-1 px-2 leading-tight">
                        {t("admin.editButton")}
                      </SecondaryButton>
                    </Link>
                    <DangerButton
                      onClick={() => handleDelete(event.eventId)}
                      className="text-xs py-1 px-2 leading-tight"
                    >
                      {t("admin.deleteButton")}
                    </DangerButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mx-auto h-16 w-16 text-muted mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl text-text font-semibold mb-2">
            {t("admin.noEventsTitle")}
          </p>
          <p className="text-muted mb-6">{t("admin.noEventsMessage")}</p>
          <Link to="/admin/dashboard/events/new">
            <PrimaryButton className="text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-2 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              {t("admin.createEventButton")}
            </PrimaryButton>
          </Link>
        </Card>
      )}
    </div>
  );
}
