"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatIdr } from "@/shared/lib/commerce/core";
import type { CommerceMode, OrderView } from "@/shared/lib/commerce/types";

export function OrderStatusContent({
  initialOrder,
  orderToken,
  mode,
}: {
  initialOrder: OrderView;
  orderToken: string;
  mode: CommerceMode;
}): React.JSX.Element {
  const [order, setOrder] = React.useState(initialOrder);
  const [busy, setBusy] = React.useState(false);
  const paid = order.status === "paid";

  async function simulatePayment(): Promise<void> {
    setBusy(true);
    try {
      const response = await fetch("/api/commerce/demo-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderToken }),
      });
      const body = (await response.json()) as { order?: OrderView };
      if (response.ok && body.order) setOrder(body.order);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[900px] px-6 pb-20 pt-12 sm:px-8 lg:px-12">
      <div className="border-y border-border-warm py-8">
        <div className="flex items-start gap-4">
          {paid ? <CheckCircle2 className="mt-1 h-7 w-7 text-emerald-700" /> : <Clock3 className="mt-1 h-7 w-7 text-amber-700" />}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-crimson">Order {order.orderNumber}</p>
            <h1 className="mt-2 text-3xl font-bold">{paid ? "Payment confirmed" : "Awaiting payment"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Hello {order.customerName}. This private page is accessible only through its order token.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 divide-y divide-border-warm border-y border-border-warm">
        {order.items.map((item) => (
          <div key={item.commerceVariantId} className="flex justify-between gap-6 py-5 text-sm">
            <div><strong>{item.productName}</strong><p className="mt-1 text-xs text-muted-foreground">{item.variantLabel} | {item.sku} | Qty {item.quantity}</p></div>
            <strong>{formatIdr(item.lineTotalIdr)}</strong>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between text-lg"><strong>Total</strong><strong>{formatIdr(order.totalIdr)}</strong></div>

      {mode === "demo" && order.status === "awaiting_payment" && (
        <div className="mt-8 border border-brand-crimson/30 bg-brand-crimson/5 p-6">
          <p className="text-sm font-semibold">Controlled demo payment</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">This changes only the in-memory demo order. It never calls Midtrans or moves real funds.</p>
          <Button type="button" onClick={simulatePayment} disabled={busy} className="mt-4 bg-foreground text-white">
            <RefreshCw className={busy ? "animate-spin" : ""} /> {busy ? "Processing..." : "Simulate successful payment"}
          </Button>
        </div>
      )}
      <Link href="/shop" className="mt-8 inline-block border-b border-foreground pb-1 text-sm font-semibold">Return to shop</Link>
    </div>
  );
}

