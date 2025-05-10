import { PrimaryButton } from "../../components/primary-button";
import { Card } from "../../components/card";
import { registerUser } from "../../actions/auth";
import { createFileRoute, Link } from "@tanstack/react-router";
import { router } from "@/main";

export const Route = createFileRoute("/(auth)/register")({
  component: Register,
});

export default function Register() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Card className="max-w-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await registerUser(new FormData(e.currentTarget));
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
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="********"
            />
          </div>
          <PrimaryButton type="submit">Register</PrimaryButton>
        </form>
        <div className="mt-4 text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
