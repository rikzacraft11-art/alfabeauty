import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
      <h1 className="type-h2">Page not found</h1>
      <p className="type-body text-zinc-700">The page you’re looking for doesn’t exist.</p>
      <Link href="/en" className="inline-flex h-10 items-center justify-center border border-zinc-200 bg-white px-4 type-data text-zinc-900 hover:bg-zinc-50">
        Back to home
      </Link>
    </div>
  );
}
