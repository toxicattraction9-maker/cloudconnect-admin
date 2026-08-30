import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const title = "Admin Sign In — YonoAppsCenter";
const description = "Sign in to manage app descriptions and screenshots on YonoAppsCenter.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const USERNAME_EMAIL_DOMAIN = "yonoappcenter.app";

function toEmail(value: string) {
  const raw = value.trim().toLowerCase();
  if (raw.includes("@")) return raw;
  return `${raw.replace(/[^a-z0-9._-]/g, "")}@${USERNAME_EMAIL_DOMAIN}`;
}

function AuthPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const email = toEmail(username);
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          toast.success("Account created. You can sign in now.");
          setMode("signin");
          return;
        }

        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-xl font-extrabold tracking-tight text-foreground">Admin Sign In</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Only admin accounts can edit app content.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            required
            maxLength={255}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="master900"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={onGoogle}>
          Continue with Google
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="w-full text-center text-xs font-semibold text-primary"
        >
          {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
      </form>
    </div>
  );
}
