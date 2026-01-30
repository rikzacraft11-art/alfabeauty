import Skeleton, { ArticleCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-16 space-y-4">
                    <Skeleton variant="text" className="w-24" />
                    <Skeleton variant="title" className="h-12 w-full max-w-lg" />
                    <Skeleton variant="text" lines={2} className="max-w-2xl" />
                </div>

                <div className="mb-24">
                    <div className="flex justify-between mb-8">
                        <Skeleton variant="title" className="h-8 w-48" />
                        <Skeleton variant="text" className="w-24" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <ArticleCardSkeleton key={i} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-8">
                        <Skeleton variant="title" className="h-8 w-48" />
                        <Skeleton variant="text" className="w-24" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <ArticleCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
