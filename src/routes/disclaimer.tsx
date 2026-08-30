import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";

const title = "Disclaimer | YonoAppsCenter";
const description =
  "Read the full YonoAppsCenter disclaimer in English and Hindi: no ownership of listed apps, no earning guarantee, 18+ only and third-party link responsibility.";

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
      intro="Please read this disclaimer carefully before using YonoAppsCenter. कृपया इस वेबसाइट का उपयोग करने से पहले यह डिस्क्लेमर ध्यान से पढ़ें।"
    >
      <LegalSection heading="1. Information only / केवल जानकारी">
        <p>
          All content on YonoAppsCenter is published for general information purposes only. We make
          no representation or warranty of any kind, express or implied, about the completeness,
          accuracy, reliability, suitability or availability of any app, link, rating or description
          shown on this website.
        </p>
        <p>
          इस वेबसाइट की सारी सामग्री केवल सामान्य जानकारी के लिए है। किसी भी ऐप, लिंक, रेटिंग या
          विवरण की पूर्णता, सटीकता या उपलब्धता की हम कोई गारंटी नहीं देते।
        </p>
      </LegalSection>

      <LegalSection heading="2. No ownership of apps / ऐप्स का स्वामित्व नहीं">
        <p>
          We are not the developer, owner or operator of any application listed here. We do not host
          APK files on our servers. All app names, logos and trademarks belong to their respective
          owners and are used only for identification purposes.
        </p>
        <p>
          हम यहाँ दिखाए गए किसी भी ऐप के डेवलपर या मालिक नहीं हैं और न ही कोई APK फाइल होस्ट करते
          हैं। सभी नाम, लोगो और ट्रेडमार्क उनके संबंधित मालिकों के हैं।
        </p>
      </LegalSection>

      <LegalSection heading="3. No earning guarantee / कमाई की गारंटी नहीं">
        <p>
          Any figures, bonuses, referral commissions or income examples mentioned on this website or
          inside a listed app are illustrative only. We do not promise, guarantee or assure any
          income, bonus, withdrawal or profit. You may lose money. Play only with an amount you can
          comfortably afford to lose.
        </p>
        <p>
          यहाँ या किसी ऐप में दिखाए गए बोनस, रेफरल कमीशन या कमाई के उदाहरण केवल संकेतात्मक हैं। हम
          किसी भी कमाई, बोनस या विदड्रॉल की गारंटी नहीं देते। आपका पैसा डूब भी सकता है — उतना ही
          खेलें जितना आप खो सकते हैं।
        </p>
      </LegalSection>

      <LegalSection heading="4. Third-party links / थर्ड-पार्टी लिंक">
        <p>
          This website contains links to external websites and download pages that are not operated
          by us. We have no control over the content, privacy policies, payment systems or practices
          of these third parties and accept no responsibility for them. Visiting such links is
          entirely at your own risk.
        </p>
        <p>
          इस वेबसाइट पर बाहरी लिंक हैं जो हमारे नियंत्रण में नहीं हैं। उनकी सामग्री, प्राइवेसी
          पॉलिसी या भुगतान प्रणाली के लिए हम ज़िम्मेदार नहीं हैं। ऐसे लिंक अपने जोखिम पर खोलें।
        </p>
      </LegalSection>

      <LegalSection heading="5. Legal and age restriction / कानूनी व आयु सीमा">
        <p>
          Real-money gaming laws differ from state to state in India and from country to country.
          Some states prohibit online games played for money. This website is meant only for users
          who are 18 years or older and located where such use is legal. It is your responsibility
          to check local law before downloading or playing.
        </p>
        <p>
          भारत में हर राज्य के गेमिंग कानून अलग हैं और कुछ राज्यों में पैसे वाले ऑनलाइन गेम
          प्रतिबंधित हैं। यह वेबसाइट केवल 18+ उपयोगकर्ताओं के लिए है। उपयोग से पहले अपने क्षेत्र का
          कानून जाँचना आपकी ज़िम्मेदारी है।
        </p>
      </LegalSection>

      <LegalSection heading="6. Limitation of liability / देयता की सीमा">
        <p>
          In no event shall YonoAppsCenter or its team be liable for any loss or damage, including
          without limitation financial loss, data loss, device damage or loss of profits, arising
          out of or in connection with the use of this website or any listed application.
        </p>
        <p>
          किसी भी परिस्थिति में YonoAppsCenter या हमारी टीम आर्थिक नुकसान, डेटा हानि, डिवाइस को
          नुकसान या मुनाफे की हानि के लिए ज़िम्मेदार नहीं होगी।
        </p>
      </LegalSection>

      <LegalSection heading="7. Responsible gaming / ज़िम्मेदार गेमिंग">
        <p>
          Gaming can be addictive. Set a budget, take regular breaks, never borrow money to play and
          seek help if playing stops being fun. If you feel you have lost control, stop immediately
          and talk to family or a professional counsellor.
        </p>
        <p>
          गेमिंग की लत लग सकती है। बजट तय करें, ब्रेक लें, खेलने के लिए कभी उधार न लें और अगर
          नियंत्रण छूटता लगे तो तुरंत रुकें और परिवार या काउंसलर से बात करें।
        </p>
      </LegalSection>

      <LegalSection heading="8. Removal requests / हटाने का अनुरोध">
        <p>
          If you are the rightful owner of any content or app listed here and want it removed or
          corrected, contact us through the Contact Us page. Verified requests are handled within 48
          hours.
        </p>
        <p>
          यदि आप किसी सामग्री या ऐप के असली मालिक हैं और उसे हटवाना चाहते हैं, तो Contact Us पेज से
          संपर्क करें। सत्यापित अनुरोध 48 घंटे में पूरे किए जाते हैं।
        </p>
      </LegalSection>
    </LegalPage>
  );
}
