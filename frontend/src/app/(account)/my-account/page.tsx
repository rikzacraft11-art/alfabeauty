import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account — Dashboard",
  description: "Manage your Alfa Beauty account, view orders, and update your profile.",
  alternates: { canonical: "/my-account" },
};

export default function MyAccountPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background">
      <section className="container mx-auto px-4 py-20 min-h-[60vh]">
        <h1 className="text-h1 font-bold tracking-tight text-foreground mb-4">
          My Account
        </h1>
        <p className="text-body text-muted-foreground">
          Account dashboard — coming soon. View your orders, manage addresses, and update your profile.
        </p>
      </section>
    </main>
  );
}
