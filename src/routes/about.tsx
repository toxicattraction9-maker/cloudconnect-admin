import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";

const title = "About Us | YonoAppsCenter";
const description =
  "YonoAppsCenter is an independent listing directory that helps Indian users discover trusted Android earning and gaming apps in one clean, ad-free place.";

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
      intro="YonoAppsCenter is an independent listing directory built to help users find popular Android apps quickly, without confusing pop-ups or clutter. YonoAppsCenter एक स्वतंत्र ऐप डायरेक्टरी है जहाँ आप भरोसेमंद Android ऐप्स आसानी से खोज सकते हैं।"
    >
      <LegalSection heading="Who we are / हम कौन हैं">
        <p>
          YonoAppsCenter is run by a small independent team of Android enthusiasts. We spend our
          time collecting, verifying and organising links for popular gaming, rummy, colour
          prediction and earning applications so that users do not have to search through dozens of
          unsafe websites. Every listing on this site is placed manually and reviewed before it goes
          live.
        </p>
        <p>
          YonoAppsCenter एक छोटी और स्वतंत्र टीम द्वारा चलाया जाता है। हम गेमिंग, रम्मी, कलर
          प्रेडिक्शन और अर्निंग ऐप्स के लिंक इकट्ठा करके एक जगह पर रखते हैं, ताकि आपको असुरक्षित
          वेबसाइटों पर भटकना न पड़े। हर लिस्टिंग को लाइव करने से पहले हाथ से जाँचा जाता है।
        </p>
      </LegalSection>

      <LegalSection heading="What we do / हम क्या करते हैं">
        <p>
          We collect and organise app listings in one clean catalogue. Every entry shows the app
          name, icon, category tag, community rating, screenshots and a short description so you can
          compare options at a glance and open the official page you are interested in. We also
          publish ranking updates, featured collections and simple how-to guidance for installing
          APK files safely on Android.
        </p>
        <p>
          हम ऐप्स को एक साफ़ कैटलॉग में व्यवस्थित करते हैं — नाम, आइकन, कैटेगरी, रेटिंग, स्क्रीनशॉट
          और छोटा विवरण, ताकि आप तुलना करके सही ऐप चुन सकें। साथ ही हम रैंकिंग अपडेट और सुरक्षित
          इंस्टॉलेशन की जानकारी भी देते हैं।
        </p>
      </LegalSection>

      <LegalSection heading="What we are not / हम क्या नहीं हैं">
        <p>
          We are not a developer, publisher or operator of any app listed here. We do not host APK
          files on our servers, we do not process payments, we do not run any game, and we are not
          affiliated with Google Play, any app brand, any bank, or any gaming platform mentioned on
          this site. All trademarks and app names belong to their respective owners.
        </p>
        <p>
          हम किसी भी ऐप के डेवलपर, मालिक या ऑपरेटर नहीं हैं। हम APK फाइलें होस्ट नहीं करते, न ही कोई
          भुगतान लेते हैं। यहाँ दिखाए गए सभी ट्रेडमार्क और नाम उनके संबंधित मालिकों के हैं।
        </p>
      </LegalSection>

      <LegalSection heading="Editorial and ranking policy / रैंकिंग नीति">
        <p>
          App rank, badges and featured placement are decided by our internal team based on user
          demand, stability of the download link, rating feedback and how often an app is reported
          for problems. Rankings can change at any time and are not a guarantee of quality, payout
          or profit.
        </p>
        <p>
          ऐप की रैंक और फीचर्ड जगह हमारी टीम तय करती है — यूज़र की माँग, लिंक की स्थिरता और
          फीडबैक के आधार पर। यह रैंकिंग कभी भी बदल सकती है और किसी कमाई की गारंटी नहीं देती।
        </p>
      </LegalSection>

      <LegalSection heading="Our promise / हमारा वादा">
        <p>
          No forced sign-ups, no hidden redirects, no misleading download buttons and no selling of
          personal data. We never ask for OTP, UPI PIN, passwords or bank details. If a listing is
          out of date, broken, or you are an owner who wants an app removed, contact us on the
          Contact Us page and we will review the request within 48 hours.
        </p>
        <p>
          कोई ज़बरदस्ती साइन-अप नहीं, कोई छिपा हुआ रीडायरेक्ट नहीं और कोई डेटा बिक्री नहीं। हम कभी
          OTP, UPI पिन या पासवर्ड नहीं माँगते। किसी शिकायत या हटाने के अनुरोध के लिए Contact Us पेज
          से संपर्क करें — हम 48 घंटे में जवाब देते हैं।
        </p>
      </LegalSection>

      <LegalSection heading="Age restriction / आयु सीमा">
        <p>
          This website and the apps listed on it are intended only for users aged 18 years and
          above. Real-money gaming may be restricted or illegal in some Indian states. It is your
          responsibility to confirm the rules that apply in your location before using any app.
        </p>
        <p>
          यह वेबसाइट और यहाँ दिए गए ऐप्स केवल 18 वर्ष या उससे अधिक उम्र के लोगों के लिए हैं। कुछ
          राज्यों में रियल-मनी गेमिंग प्रतिबंधित है — उपयोग से पहले अपने राज्य के नियम ज़रूर जाँचें।
        </p>
      </LegalSection>
    </LegalPage>
  );
}
