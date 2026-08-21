"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatIdr } from "@/shared/lib/commerce/core";
import type { CommerceOffer } from "@/shared/lib/commerce/types";

export function AddToCartPanel({ offers }: { offers: CommerceOffer[] }): React.JSX.Element {
  const available = offers.filter((offer) => offer.active && offer.stockAvailable > 0);
  const [variantId, setVariantId] = React.useState(available[0]?.commerceVariantId ?? "");
  const [quantity, setQuantity] = React.useState(1);
  const [state, setState] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const selected = available.find((offer) => offer.commerceVariantId === variantId);

  async function addToCart(): Promise<void> {
    if (!selected) return;
    setState("saving");
    try {
      const response = await fetch("/api/commerce/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commerceVariantId: selected.commerceVariantId, quantity }),
      });
      if (!response.ok) throw new Error("Cart update failed");
      setState("saved");
    } catch {
      setState("error");
    }
  }

  if (!available.length) {
    return (
      <div className="border border-border-warm/70 bg-surface p-5">
        <p className="text-sm font-semibold text-foreground">Currently unavailable</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          This product does not have an active commerce offer.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border-warm/70 bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-crimson">
            {selected?.demo ? "Demo offer" : "Sandbox offer"}
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {selected ? formatIdr(selected.priceIdr) : "Unavailable"}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">{selected?.stockAvailable ?? 0} available</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_96px]">
        <label className="text-xs font-semibold text-foreground">
          Variant
          <select
            value={variantId}
            onChange={(event) => {
              setVariantId(event.target.value);
              setState("idle");
            }}
            className="mt-2 h-11 w-full border border-border-warm bg-background px-3 text-sm outline-none focus:border-foreground"
          >
            {available.map((offer) => (
              <option key={offer.commerceVariantId} value={offer.commerceVariantId}>
                {offer.label} - {formatIdr(offer.priceIdr)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-foreground">
          Quantity
          <input
            type="number"
            min={1}
            max={Math.min(selected?.stockAvailable ?? 1, 20)}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Math.min(20, Number(event.target.value))))}
            className="mt-2 h-11 w-full border border-border-warm bg-background px-3 text-sm outline-none focus:border-foreground"
          />
        </label>
      </div>

      <Button
        type="button"
        onClick={addToCart}
        disabled={!selected || state === "saving"}
        className="mt-4 h-12 w-full bg-foreground text-white hover:bg-foreground/90"
      >
        {state === "saved" ? <Check /> : <ShoppingCart />}
        {state === "saving" ? "Adding..." : state === "saved" ? "Added to cart" : "Add to cart"}
      </Button>
      <div className="mt-3 min-h-5 text-xs">
        {state === "saved" && <Link href="/cart" className="font-semibold text-brand-crimson">View cart</Link>}
        {state === "error" && <span className="text-destructive">Unable to add this offer. Refresh and try again.</span>}
      </div>
    </div>
  );
}

