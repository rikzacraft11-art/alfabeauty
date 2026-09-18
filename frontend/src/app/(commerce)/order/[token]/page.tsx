import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderStatusContent } from "@/features/commerce/components/order-status-content";
import { getCommerceMode } from "@/shared/lib/commerce/env";
import { getOrder } from "@/shared/lib/commerce/service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Order Status — Private Confirmation",
  description: "Check the current payment and fulfillment status of your private order.",
  robots: { index: false, follow: false, nocache: true },
};

type Props = {
  params: Promise<{ token: string }>;
};

export default async function OrderStatusPage({
  params,
}: Props): Promise<React.JSX.Element> {
  const { token } = await params;
  const order = await getOrder(token);
  if (!order) notFound();
  return (
    <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
      <OrderStatusContent initialOrder={order} orderToken={token} mode={getCommerceMode()} />
    </main>
  );
}

