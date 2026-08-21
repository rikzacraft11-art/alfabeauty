import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderStatusContent } from "@/features/commerce/components/order-status-content";
import { getCommerceMode } from "@/shared/lib/commerce/env";
import { getOrder } from "@/shared/lib/commerce/service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private order status",
  robots: { index: false, follow: false, nocache: true },
};

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<React.JSX.Element> {
  const { token } = await params;
  const order = await getOrder(token);
  if (!order) notFound();
  return (
    <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
      <OrderStatusContent initialOrder={order} orderToken={token} mode={getCommerceMode()} />
    </main>
  );
}

