import Skeleton, { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-12 space-y-4">
                    <Skeleton variant="text" className="w-24" />
                    <Skeleton variant="title" className="h-12 w-full max-w-lg" />
                    <Skeleton variant="text" lines={2} className="max-w-2xl" />
                </div>

                <div className="mb-8">
                    <Skeleton className="h-16 w-full rounded-xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </main>
    );
}
