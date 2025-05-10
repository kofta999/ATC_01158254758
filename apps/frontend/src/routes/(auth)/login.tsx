import { PrimaryButton } from "../../components/primary-button";
import { Card } from "../../components/card";
import { loginUser } from "@/actions/auth";
import { createFileRoute, Link } from "@tanstack/react-router";
import { router } from "@/main";

export const Route = createFileRoute("/(auth)/login")({
  component: Login,
});

export default function Login() {
  return (
    <Card className="max-w-lg w-96">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault(); // Prevent default form submission
          try {
            await loginUser(new FormData(e.currentTarget));
            router.navigate({ to: "/" });
          } catch (error: any) {
            // Handle errors (e.g., display an error message)
            console.error("Login failed:", error.message);
            alert(error.message); // Display error message to the user
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
            name="email"
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
            name="password"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="********"
          />
        </div>
        <PrimaryButton type="submit">Login</PrimaryButton>
      </form>
      <div className="mt-4 text-sm">
        <Link to="/register" className="text-primary hover:underline">
          Don't have an account? Register
        </Link>
      </div>
    </Card>
  );
}
