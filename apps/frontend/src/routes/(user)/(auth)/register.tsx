import { PrimaryButton } from "@/components/primary-button";
import { Card } from "@/components/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { router } from "@/main";
import { RegisterUserSchema } from "@/lib/schemas";
import { useAuth } from "@/lib/hooks/use-auth";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/(user)/(auth)/register")({
  component: Register,
});

export default function Register() {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex flex-grow items-center justify-center py-6">
      <Card className="max-w-lg w-96">
        <h1 className="text-2xl font-bold mb-4">{t("auth.registerTitle")}</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const parsed = RegisterUserSchema.parse(
                new FormData(e.currentTarget),
              );

              await auth.register(parsed.email, parsed.password);
              router.navigate({ to: "/login" });
            } catch (error: any) {
              console.error("Registration failed:", error.message);
              alert(error.message);
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
            />
          </div>
          <PrimaryButton type="submit">{t("auth.registerButton")}</PrimaryButton>
        </form>
        <div className="mt-4 text-sm">
          <Link to="/login" className="text-primary hover:underline">
            {t("auth.alreadyAccountPrompt")} {t("auth.loginLink")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
