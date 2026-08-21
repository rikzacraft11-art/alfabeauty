"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatIdr } from "@/shared/lib/commerce/core";
import type { CartView, CheckoutResult } from "@/shared/lib/commerce/types";

const fields = [
  ["name", "Full name", "text", "customer"],
  ["email", "Email", "email", "customer"],
  ["phone", "Phone", "tel", "customer"],
  ["street", "Street address", "text", "shippingAddress"],
  ["city", "City", "text", "shippingAddress"],
  ["province", "Province", "text", "shippingAddress"],
  ["postalCode", "Postal code", "text", "shippingAddress"],
] as const;

export function CheckoutForm(): React.JSX.Element {
  const [cart, setCart] = React.useState<CartView | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const idempotencyKey = React.useRef(crypto.randomUUID());

  React.useEffect(() => {
    void fetch("/api/commerce/cart", { cache: "no-store" })
      .then(async (response) => {
        const body = (await response.json()) as { cart?: CartView };
        if (!response.ok || !body.cart) throw new Error();
        setCart(body.cart);
      })
      .catch(() => setError("Unable to load the cart."));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      idempotencyKey: idempotencyKey.current,
      customer: {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
      },
      shippingAddress: {
        street: String(form.get("street") ?? ""),
        city: String(form.get("city") ?? ""),
        province: String(form.get("province") ?? ""),
        postalCode: String(form.get("postalCode") ?? ""),
        country: "ID",
      },
    };
    try {
      const response = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { checkout?: CheckoutResult; error?: string };
      if (!response.ok || !body.checkout) throw new Error(body.error || "Checkout failed");
      window.location.assign(body.checkout.redirectUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-20 pt-10 sm:px-8 lg:px-12">
      <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} className="border-t border-border-warm pt-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-crimson">Guest checkout</p>
          <h1 className="mt-2 text-3xl font-bold">Delivery details</h1>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {fields.map(([name, label, type]) => (
              <label key={name} className={name === "street" ? "text-sm font-semibold sm:col-span-2" : "text-sm font-semibold"}>
                {label}
                <input
                  required
                  name={name}
                  type={type}
                  autoComplete={name === "name" ? "name" : name}
                  maxLength={name === "street" ? 300 : 120}
                  className="mt-2 h-12 w-full border border-border-warm bg-background px-4 text-sm outline-none focus:border-foreground"
                />
              </label>
            ))}
          </div>
          {error && <p className="mt-5 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting || !cart?.items.length} className="mt-7 h-12 bg-foreground px-8 text-white">
            <LockKeyhole /> {submitting ? "Creating secure checkout..." : "Continue to payment"}
          </Button>
        </form>

        <aside className="h-fit border border-border-warm p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em]">Summary</h2>
          <div className="mt-5 space-y-3">
            {cart?.items.map((item) => (
              <div key={item.commerceVariantId} className="flex justify-between gap-4 text-xs">
                <span>{item.productName} x {item.quantity}</span>
                <span className="font-semibold">{formatIdr(item.lineTotalIdr)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-border-warm pt-5 text-sm">
            <strong>Total</strong><strong>{formatIdr(cart?.subtotalIdr ?? 0)}</strong>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Demo mode uses a local payment simulator. Sandbox mode redirects to Midtrans Sandbox. No real funds are charged.
          </p>
        </aside>
      </div>
    </div>
  );
}

