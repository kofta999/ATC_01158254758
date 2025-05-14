import { PrimaryButton } from "@/components/primary-button";
import { Card } from "@/components/card";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoginUserSchema } from "@/lib/schemas";
import { z } from "zod";
import { router } from "@/main";
import { useTranslation } from "react-i18next";

// Define the expected search parameters for this route
const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined), // Make redirect optional
});

export const Route = createFileRoute("/(user)/(auth)/login")({
  component: Login,
  validateSearch: (search) => loginSearchSchema.parse(search), // Validate search params
});

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Access validated search params
  const { redirect } = Route.useSearch();

  return (
    <div className="flex flex-grow items-center justify-center py-6">
      <Card className="max-w-lg w-96">
        <h1 className="text-2xl font-bold mb-4">{t("auth.loginTitle")}</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const formData = new FormData(e.currentTarget);
              // Validate form data against LoginUserSchema
              const parsed = LoginUserSchema.parse(formData);

              const loginSuccess = await auth.login(
                parsed.email,
                parsed.password,
                "USER",
              );

              if (loginSuccess) {
                await router.invalidate();
                navigate({ to: redirect || "/", replace: true });
              } else {
                // Login attempt failed (handled within auth.login with an alert for now)
                // You might want more specific error handling here if auth.login doesn't alert.
                console.error("Login attempt failed.");
              }
            } catch (error: any) {
              // Handle Zod parsing errors or other unexpected errors
              console.error("Login submission error:", error.message);
              // It's better to display errors in the UI rather than alert
              alert(
                error.message || "An unexpected error occurred during login.",
              );
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
              placeholder="your@email.com"
              required
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
              placeholder="********"
              required
            />
          </div>
          <PrimaryButton type="submit">{t("auth.loginButton")}</PrimaryButton>
        </form>
        <div className="mt-4 text-sm">
          <Link to="/register" className="text-primary hover:underline">
            {t("auth.noAccountPrompt")} {t("auth.registerLink")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
