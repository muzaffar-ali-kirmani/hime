"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { ShopLayout } from "@/components/shop-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api-client";
import { useStore } from "@/lib/store-provider";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.login(email, password);
      await refreshUser();
      toast.success("Welcome back");
      router.push("/account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ShopLayout>
      <section className="container-wide py-12 sm:py-20">
        <div className="mx-auto max-w-md">
          <header className="mb-8 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
              Welcome back
            </p>
            <h1 className="font-serif text-4xl text-navy sm:text-5xl">Sign in</h1>
            <p className="mt-3 text-sm text-navy/60">
              Continue your story, pick up where you left off.
            </p>
          </header>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8"
          >
            <div>
              <Label className="text-xs uppercase tracking-widest">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-navy/40" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-full pl-11"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-navy/40" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-full pl-11"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
            >
              {submitting ? "Signing in…" : "Sign in"}
              <ArrowRight className="ms-2 size-3.5" />
            </Button>
            <p className="text-center text-xs text-navy/60">
              New here?{" "}
              <Link href="/signup" className="text-gold hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </ShopLayout>
  );
}