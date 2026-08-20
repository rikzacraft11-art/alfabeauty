import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register — Create Your Account",
  description: "Create an Alfa Beauty account to shop, track orders, and save your preferences.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background flex items-center justify-center min-h-[80vh]">
      <section className="w-full max-w-md px-4 py-20">
        <h1 className="text-h2 font-bold tracking-tight text-foreground mb-2 text-center">
          Create Account
        </h1>
        <p className="text-body text-muted-foreground text-center mb-8">
          Join Alfa Beauty for exclusive access
        </p>
        {/* Registration form will be implemented here */}
      </section>
    </main>
  );
}
