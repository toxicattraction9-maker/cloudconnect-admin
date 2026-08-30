import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-border bg-secondary">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <p className="text-sm font-bold text-foreground">YonoAppsCenter</p>
        <p className="mt-1 text-xs text-muted-foreground">
          A listing directory for Android apps. We do not host or own any app.
        </p>
        <nav className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium">
          <Link to="/about" className="text-muted-foreground hover:text-primary">
            About Us
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-primary">
            Contact Us
          </Link>
          <Link to="/disclaimer" className="text-muted-foreground hover:text-primary">
            Disclaimer
          </Link>
          <Link to="/terms" className="text-muted-foreground hover:text-primary">
            Terms &amp; Conditions
          </Link>
        </nav>
        <p className="mt-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} YonoAppsCenter. All rights reserved. 18+ only.
        </p>
      </div>
    </footer>
  );
}
