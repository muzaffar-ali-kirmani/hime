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

export default function SignupPage() {
  const router = useRouter();
  const { refreshUser } = useStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.signup(form);
      const me = await api.me();
      await refreshUser();
      toast.success("Welcome to Hime");
      const isAdmin = me.user?.email?.toLowerCase().endsWith("@hime.jewellery");
      router.push(isAdmin ? "/admin" : "/account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
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
              New here
            </p>
            <h1 className="font-serif text-4xl text-navy sm:text-5xl">Create account</h1>
            <p className="mt-3 text-sm text-navy/60">
              Join for saved designs, faster checkout and a birthday gift.
            </p>
          </header>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs uppercase tracking-widest">First name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-navy/40" />
                  <Input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="h-12 rounded-full pl-11"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest">Last name</Label>
                <Input
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="mt-2 h-12 rounded-full"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-navy/40" />
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="h-12 rounded-full pl-11"
                />
              </div>
              <p className="mt-1 text-[10px] text-navy/50">
                At least 8 characters
              </p>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-navy py-6 text-xs uppercase tracking-widest text-cream hover:bg-navy/90"
            >
              {submitting ? "Creating account…" : "Create account"}
              <ArrowRight className="ms-2 size-3.5" />
            </Button>
            <p className="text-center text-xs text-navy/60">
              Already a member?{" "}
              <Link href="/login" className="text-gold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </ShopLayout>
  );
}