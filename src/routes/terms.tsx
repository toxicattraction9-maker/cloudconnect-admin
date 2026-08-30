import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";

const title = "Terms & Conditions | YonoAppsCenter";
const description =
  "The terms and conditions that govern your use of YonoAppsCenter, including acceptable use, intellectual property and changes to the service.";

export const Route = createFileRoute("/terms")({
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
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="By browsing YonoAppsCenter you agree to the terms below. If you do not agree with any part of them, please stop using this website."
    >
      <LegalSection heading="1. Use of the website">
        <p>
          YonoAppsCenter is provided free of charge for informational purposes. You agree to
          use it lawfully and not to scrape, copy in bulk, overload, or attempt to gain
          unauthorised access to any part of the site.
        </p>
      </LegalSection>
      <LegalSection heading="2. External links">
        <p>
          Listings point to external websites. Once you leave this site, the terms and
          privacy policy of that third party apply. We are not responsible for their
          content or actions.
        </p>
      </LegalSection>
      <LegalSection heading="3. Intellectual property">
        <p>
          App names, icons and logos belong to their respective owners and are shown only to
          identify the listing. The layout and original text of this website belong to
          YonoAppsCenter.
        </p>
      </LegalSection>
      <LegalSection heading="4. No warranty">
        <p>
          The site is provided "as is" without warranties of any kind. Listings, ratings and
          availability can change or become inaccurate at any time.
        </p>
      </LegalSection>
      <LegalSection heading="5. Changes">
        <p>
          We may update these terms at any time. Continued use of the website after an
          update means you accept the revised terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
