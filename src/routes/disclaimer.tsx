import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";

const title = "Disclaimer | YonoAppsCenter";
const description =
  "Read the YonoAppsCenter disclaimer covering third-party app listings, financial risk, age restrictions and limitation of liability.";

export const Route = createFileRoute("/disclaimer")({
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
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="Please read this disclaimer carefully before using YonoAppsCenter or opening any listing shown on this website."
    >
      <LegalSection heading="Third-party content">
        <p>
          All apps listed here are owned and operated by third parties. YonoAppsCenter only
          links to them. We do not control, verify or guarantee their content, payouts,
          availability, security or business practices.
        </p>
      </LegalSection>
      <LegalSection heading="No financial advice">
        <p>
          Nothing on this site is financial, investment or legal advice. Any app that
          involves money carries a real risk of loss. Only you are responsible for the money
          you spend and for any outcome of using a listed app.
        </p>
      </LegalSection>
      <LegalSection heading="Age and local law">
        <p>
          This website is intended for users aged 18 and above. Rules for real-money gaming
          differ between states and countries. It is your responsibility to confirm that
          using any listed app is legal where you live.
        </p>
      </LegalSection>
      <LegalSection heading="Limitation of liability">
        <p>
          YonoAppsCenter and its operators accept no liability for any direct or indirect
          loss, damage, data loss or dispute resulting from downloading, installing or using
          any third-party app discovered through this site.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
