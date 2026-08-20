import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Sign In to Your Account",
  description: "Sign in to your Alfa Beauty account to track orders and manage your profile.",
  alternates: { canonical: "/login" },
};

export default function LoginPage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background flex items-center justify-center min-h-[80vh]">
      <section className="w-full max-w-md px-4 py-20">
        <h1 className="text-h2 font-bold tracking-tight text-foreground mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-body text-muted-foreground text-center mb-8">
          Sign in to your account
        </p>
        {/* Auth form will be implemented here */}
      </section>
    </main>
  );
}
