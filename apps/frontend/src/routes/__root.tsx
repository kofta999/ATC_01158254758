import { type AuthContextType } from "@/lib/hooks/use-auth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import i18n from "@/i18n";

type RouterContext = {
  auth: AuthContextType | undefined;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <RootLayout />
      {/* Render Devtools outside the main flex layout if preferred, or inside if that works better for your z-indexing */}
      <TanStackRouterDevtools position="bottom-left" />
    </>
  ),
});

export default function RootLayout() {
  return (
    <div className="font-display bg-background text-text min-h-screen flex flex-col">
      {/* Added default text color */}
      {/* Meta tags and link tags for favicon should ideally be in your public/index.html
          or managed with a library like React Helmet for better SEO and standards compliance.
          <meta name="description" content="Evently - Your go-to platform for events!" />
          <link rel="icon" type="image/png" href="/images/favicon.png" />
      */}
      <Header />
      <main
        id="main"
        className="flex-grow container mx-auto px-4 py-6 md:py-8 w-full"
        dir={i18n.dir()}
      >
        {/* Adjusted padding slightly */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
