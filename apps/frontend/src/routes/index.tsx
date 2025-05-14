import { createFileRoute, Link } from "@tanstack/react-router";
import { PrimaryButton } from "@/components/primary-button";
import { useTranslation } from "react-i18next";
// You might want to add a hero image or illustration later
// import heroImage from "../assets/evently-hero.svg"; // Example path

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-grow items-center justify-center text-center bg-background px-4 py-12">
      {/* Hero Section */}
      <section className="w-full max-w-3xl">
        {/* Optional: Logo or illustrative image */}
        {/* <img src={heroImage} alt="Evently Hero" className="w-1/2 mx-auto mb-8" /> */}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text mb-6">
          {t("landingPage.title")}
        </h1>
        <p className="text-lg sm:text-xl text-muted max-w-xl mx-auto mb-10">
          {t("landingPage.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/events">
            <PrimaryButton className="text-lg px-8 py-3 w-full sm:w-auto">
              {t("landingPage.browseEventsButton")}
            </PrimaryButton>
          </Link>

          {/* Optionally, add a secondary CTA, e.g., for organizers or learning more */}
          {/*
          <Link to="/about">
            <SecondaryButton className="text-lg px-8 py-3 w-full sm:w-auto">
              Learn More
            </SecondaryButton>
          </Link>
          */}
        </div>
      </section>

      <section className="w-full max-w-5xl mt-20 py-12">
        <h2 className="text-3xl font-bold text-text mb-10 text-center">
          {t("landingPage.whyChooseTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-surface p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-3">
              {t("landingPage.wideVarietyTitle")}
            </h3>
            <p className="text-sm text-muted">
              {t("landingPage.wideVarietyDescription")}
            </p>
          </div>
          <div className="bg-surface p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-3">
              {t("landingPage.easyBookingTitle")}
            </h3>
            <p className="text-sm text-muted">
              {t("landingPage.easyBookingDescription")}
            </p>
          </div>
          <div className="bg-surface p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-3">
              {t("landingPage.stayUpdatedTitle")}
            </h3>
            <p className="text-sm text-muted">
              {t("landingPage.stayUpdatedDescription")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
