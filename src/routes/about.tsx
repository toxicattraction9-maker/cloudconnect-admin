import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";

const title = "About Us | YonoAppsCenter";
const description =
  "YonoAppsCenter is a simple listing directory that helps Indian users discover trusted Android earning and gaming apps in one clean place.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <LegalPage
      title="About Us"
      intro="YonoAppsCenter is an independent listing directory built to help users find popular Android apps quickly, without confusing pop-ups or clutter."
    >
      <LegalSection heading="What we do">
        <p>
          We collect and organise app listings in one clean catalogue. Every entry shows the
          app name, icon, category tag and community rating so you can compare options at a
          glance and open the official page you are interested in.
        </p>
      </LegalSection>
      <LegalSection heading="What we are not">
        <p>
          We are not a developer, publisher or operator of any app listed here. We do not
          host APK files, do not process payments, and are not affiliated with Google Play,
          any app brand, or any gaming platform mentioned on this site.
        </p>
      </LegalSection>
      <LegalSection heading="Our promise">
        <p>
          No forced sign-ups, no hidden redirects and no data selling. If a listing is out
          of date or you want an app removed, contact us through our Telegram channel and we
          will review the request.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
