import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Send, Mail, ListChecks, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getSiteSettings } from "@/lib/site.functions";

const title = "Contact Us — Customer Support | YonoAppsCenter";
const description =
  "Contact YonoAppsCenter customer support on Telegram or email. 24/7 help for app installation, payment clearance and withdrawal queries.";

export const Route = createFileRoute("/contact")({
  loader: () => getSiteSettings(),
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
  component: ContactPage,
});

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-5 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function ContactPage() {
  const settings = Route.useLoaderData();
  const telegramHandle = settings.telegram_bot || "@YonoAppsCenterBot";
  const telegramUrl =
    settings.telegram_url || `https://t.me/${telegramHandle.replace(/^@/, "")}`;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(settings.contact_email);
      toast.success("Email address copied");
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="text-center">
        <span className="inline-block rounded-full border border-primary/40 px-4 py-1.5 text-[11px] font-bold tracking-widest text-primary">
          SUPPORT DESK
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Contact Customer Support
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Got questions, issues, or feedback? Our dedicated support team is available 24/7/365 to
          assist you. कोई भी समस्या हो — हमारी टीम 24 घंटे आपकी मदद के लिए मौजूद है।
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <Card className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">
            Welcome to the YonoAppsCenter Support Hub
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We value your gaming and user experience. Whether you have queries regarding APK
            installation, payment clearance, withdrawal timings, or general app features, feel free
            to connect with our official help desks below.
          </p>
        </Card>

        <Card>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Send className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mt-4 text-base font-bold text-foreground">Telegram Contact</h2>
          <p className="mt-1 font-mono text-sm font-semibold text-primary">{telegramHandle}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Join our official Telegram support bot to stay updated on the latest app releases,
            events, exclusive codes and bonuses. सबसे तेज़ जवाब टेलीग्राम पर मिलता है।
          </p>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-lg bg-secondary px-4 py-2 text-xs font-bold tracking-wide text-secondary-foreground transition-colors hover:bg-accent"
          >
            JOIN CHANNEL →
          </a>
        </Card>

        <Card>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mt-4 text-base font-bold text-foreground">Official Email Support</h2>
          <p className="mt-1 font-mono text-sm font-semibold text-primary">
            {settings.contact_email}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            For business inquiries, complex account reviews, or formal complaints, write to our
            official mailbox. बिज़नेस या शिकायत के लिए ईमेल करें।
          </p>
          <button
            type="button"
            onClick={copyEmail}
            className="mt-4 inline-flex rounded-lg bg-secondary px-4 py-2 text-xs font-bold tracking-wide text-secondary-foreground transition-colors hover:bg-accent"
          >
            COPY ADDRESS →
          </button>
        </Card>

        <Card>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <ListChecks className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mt-4 text-base font-bold text-foreground">Support Guidelines</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Provide details:</strong> state your exact app
              name, registered mobile number and transaction ID for payment queries.
            </li>
            <li>
              <strong className="text-foreground">Attach screenshots:</strong> share screenshots of
              error prompts or transaction receipts so we can debug quicker.
            </li>
            <li>
              <strong className="text-foreground">Allow response time:</strong> chat replies are
              usually under 5 minutes, but may take up to 15 minutes at peak hours.
            </li>
            <li>
              <strong className="text-foreground">One thread:</strong> please do not submit multiple
              requests for the same issue, it keeps the queue clean.
            </li>
          </ul>
          {settings.support_note ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {settings.support_note}
            </p>
          ) : null}
        </Card>

        <Card className="border-t-4 border-t-primary text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">100% Secure Chat</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            All our official support channels are protected with end-to-end encryption. We will
            NEVER ask you for your passwords, OTPs, UPI PINs or sensitive banking credentials. हम
            कभी भी आपका OTP, पासवर्ड या UPI पिन नहीं मांगते। सुरक्षित रहें।
          </p>
        </Card>
      </div>
    </div>
  );
}
