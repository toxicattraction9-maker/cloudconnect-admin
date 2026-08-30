import { Link } from "@tanstack/react-router";
import { Menu, Send } from "lucide-react";
const logo = "/images/logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const TELEGRAM_URL = "https://t.me/xnnearning";

const menuLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/disclaimer", label: "Disclaimer" },
  { to: "/terms", label: "Terms & Conditions" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img
            src={logo}
            alt="YonoAppsCenter logo"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0"
          />
          <span className="truncate text-base font-extrabold tracking-tight text-foreground">
            Yono<span className="text-primary">AppsCenter</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm" className="gap-1.5">
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Send className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">Join TG</span>
            </a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4 pb-6">
                {menuLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    activeProps={{ className: "bg-accent text-primary" }}
                  >
                    {l.label}
                  </Link>
                ))}
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <Send className="h-4 w-4" /> Join Telegram
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
