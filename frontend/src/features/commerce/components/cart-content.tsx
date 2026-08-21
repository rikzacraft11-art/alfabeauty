"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatIdr } from "@/shared/lib/commerce/core";
import type { CartView } from "@/shared/lib/commerce/types";

const EMPTY_CART: CartView = { items: [], subtotalIdr: 0, itemCount: 0, mode: "disabled" };

export function CartContent(): React.JSX.Element {
  const [cart, setCart] = React.useState<CartView>(EMPTY_CART);
  const [loading, setLoading] = React.useState(true);
  const [busyVariant, setBusyVariant] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");

  const loadCart = React.useCallback(async () => {
    try {
      const response = await fetch("/api/commerce/cart", { cache: "no-store" });
      const body = (await response.json()) as { cart?: CartView };
      if (!response.ok || !body.cart) throw new Error("Cart unavailable");
      setCart(body.cart);
    } catch {
      setError("The cart is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => void loadCart(), [loadCart]);

  async function setQuantity(variantId: string, quantity: number): Promise<void> {
    setBusyVariant(variantId);
    setError("");
    try {
      const response = await fetch("/api/commerce/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commerceVariantId: variantId, quantity }),
      });
      const body = (await response.json()) as { cart?: CartView };
      if (!response.ok || !body.cart) throw new Error("Cart update failed");
      setCart(body.cart);
    } catch {
      setError("The cart could not be updated. Product availability may have changed.");
    } finally {
      setBusyVariant(null);
    }
  }

  if (loading) return <div className="min-h-[50vh] py-20 text-sm text-muted-foreground">Loading cart...</div>;

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-10 sm:px-8 lg:px-12">
      <div className="flex items-end justify-between border-b border-border-warm pb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-crimson">Commerce MVP</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Shopping cart</h1>
        </div>
        <span className="text-sm text-muted-foreground">{cart.itemCount} item(s)</span>
      </div>

      {error && <p className="mt-5 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

      {!cart.items.length ? (
        <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
          <h2 className="mt-5 text-xl font-bold">Your cart is empty</h2>
          <Link href="/shop" className="mt-5 border-b border-foreground pb-1 text-sm font-semibold">Browse products</Link>
        </div>
      ) : (
        <div className="grid gap-10 pt-8 lg:grid-cols-[1fr_340px]">
          <div className="divide-y divide-border-warm border-y border-border-warm">
            {cart.items.map((item) => (
              <div key={item.commerceVariantId} className="grid grid-cols-[96px_1fr] gap-5 py-6 sm:grid-cols-[120px_1fr_auto]">
                <div className="relative aspect-square bg-surface">
                  {item.image && <Image src={item.image} alt={item.productName} fill className="object-contain p-3" sizes="120px" />}
                </div>
                <div>
                  <Link href={item.slug ? `/shop/${item.slug}` : "/shop"} className="font-bold text-foreground hover:underline">
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">{item.variantLabel} | {item.sku}</p>
                  <p className="mt-3 text-sm font-semibold">{formatIdr(item.unitPriceIdr)}</p>
                  {!item.available && <p className="mt-2 text-xs text-destructive">Offer is no longer available.</p>}
                </div>
                <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end">
                  <div className="flex h-10 items-center border border-border-warm">
                    <button
                      type="button"
                      title="Decrease quantity"
                      aria-label={`Decrease ${item.productName} quantity`}
                      disabled={busyVariant === item.commerceVariantId}
                      onClick={() => setQuantity(item.commerceVariantId, Math.max(0, item.quantity - 1))}
                      className="flex h-full w-10 items-center justify-center hover:bg-surface disabled:opacity-40"
                    ><Minus className="h-4 w-4" /></button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      title="Increase quantity"
                      aria-label={`Increase ${item.productName} quantity`}
                      disabled={busyVariant === item.commerceVariantId || item.quantity >= Math.min(item.stockAvailable, 20)}
                      onClick={() => setQuantity(item.commerceVariantId, item.quantity + 1)}
                      className="flex h-full w-10 items-center justify-center hover:bg-surface disabled:opacity-40"
                    ><Plus className="h-4 w-4" /></button>
                  </div>
                  <button
                    type="button"
                    title="Remove item"
                    aria-label={`Remove ${item.productName}`}
                    disabled={busyVariant === item.commerceVariantId}
                    onClick={() => setQuantity(item.commerceVariantId, 0)}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-destructive disabled:opacity-40"
                  ><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit border border-border-warm p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em]">Order summary</h2>
            <div className="mt-6 flex justify-between border-b border-border-warm pb-5 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <strong>{formatIdr(cart.subtotalIdr)}</strong>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Shipping and tax are fixed at zero for this controlled MVP. Totals are recalculated by the server.
            </p>
            <Button asChild disabled={cart.items.some((item) => !item.available)} className="mt-6 h-12 w-full bg-foreground text-white">
              <Link href="/checkout">Continue to checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}

