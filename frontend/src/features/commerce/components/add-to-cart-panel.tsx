"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
        <p className="text-subtitle font-semibold text-foreground">Currently unavailable</p>
        <p className="mt-1 text-caption leading-relaxed text-muted-foreground">
          This product does not have an active commerce offer.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border-warm/70 bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-eyebrow font-bold text-brand-crimson">
            {selected?.demo ? "Demo offer" : "Sandbox offer"}
          </p>
          <p className="mt-1 text-h3 font-bold text-foreground">
            {selected ? formatIdr(selected.priceIdr) : "Unavailable"}
          </p>
        </div>
        <span className="text-caption text-muted-foreground">{selected?.stockAvailable ?? 0} available</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_96px]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="variant-select" className="text-caption font-semibold text-foreground">
            Variant
          </label>
          <Select
            value={variantId}
            onValueChange={(val) => {
              setVariantId(val);
              setState("idle");
            }}
          >
            <SelectTrigger id="variant-select" className="h-11 w-full border border-border-warm bg-background px-3 text-sm focus-visible:ring-1 focus-visible:ring-foreground rounded-none shadow-none">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent position="popper" align="start" className="border-border-warm/80 bg-background/95 backdrop-blur-md shadow-xl rounded-md">
              {available.map((offer) => (
                <SelectItem key={offer.commerceVariantId} value={offer.commerceVariantId} className="text-caption font-medium py-2.5 px-3 cursor-pointer">
                  {offer.label} — {formatIdr(offer.priceIdr)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label className="text-caption font-semibold text-foreground">
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
        className="mt-4 min-h-[48px] w-full bg-foreground text-cta font-bold text-white hover:bg-foreground/90"
      >
        {state === "saved" ? <Check /> : <ShoppingCart />}
        {state === "saving" ? "Adding..." : state === "saved" ? "Added to cart" : "Add to cart"}
      </Button>
      <div className="mt-3 min-h-5 text-caption">
        {state === "saved" && <Link href="/cart" className="font-semibold text-brand-crimson">View cart</Link>}
        {state === "error" && <span className="text-destructive">Unable to add this offer. Refresh and try again.</span>}
      </div>
    </div>
  );
}

