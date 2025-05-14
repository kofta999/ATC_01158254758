import { PrimaryButton } from "@/components/primary-button";
import { Card } from "@/components/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoginUserSchema } from "@/lib/schemas";
import { z } from "zod";
import { router } from "@/main";

// Define expected search parameters for this route (e.g., redirect after login)
const adminLoginSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/(admin)/admin/login")({
  component: AdminLogin,
  validateSearch: (search) => adminLoginSearchSchema.parse(search),
});

export default function AdminLogin() {
  const auth = useAuth();
  const navigate = useNavigate();
    const { t } = useTranslation();
  const { redirect } = Route.useSearch();

  return (
    <div className="flex flex-grow items-center justify-center py-12 bg-background">
      <Card className="max-w-md w-full sm:w-96">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-text">
          {t("auth.adminLoginTitle")}
        </h1>
        <form
          className="flex flex-col gap-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const formData = new FormData(e.currentTarget);
              const parsed = LoginUserSchema.parse(formData);

              const loginSuccess = await auth.login(
                parsed.email,
                parsed.password,
                "ADMIN",
              );

              if (loginSuccess) {
                await router.invalidate();
                navigate({ to: redirect || "/admin/dashboard", replace: true });
              } else {
                alert(t("admin.submissionError"));
              }
            } catch (error: any) {
              console.error("Admin login submission error:", error);
              alert(error.message || t("eventDetails.bookingErrorMessage"));
            }
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text mb-1"
            >
              {t("auth.emailLabel")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text mb-1"
            >
              {t("auth.passwordLabel")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <PrimaryButton type="submit" className="w-full py-2.5 text-base mt-2">
            {t("auth.loginAsAdminButton")}
          </PrimaryButton>
        </form>
      </Card>
    </div>
  );
}
