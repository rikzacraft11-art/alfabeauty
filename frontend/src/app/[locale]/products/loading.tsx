export default function Loading() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-12 space-y-4">
                    <div className="h-4 w-24 bg-subtle animate-pulse" />
                    <div className="h-12 w-full max-w-lg bg-subtle animate-pulse" />
                    <div className="space-y-2 max-w-2xl">
                        <div className="h-4 w-full bg-subtle animate-pulse" />
                        <div className="h-4 w-5/6 bg-subtle animate-pulse" />
                    </div>
                </div>

                <div className="mb-8">
                    <div className="h-16 w-full rounded-xl bg-subtle animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="border border-border bg-panel p-5 space-y-4">
                            <div className="h-40 bg-subtle animate-pulse" />
                            <div className="h-4 w-20 bg-subtle animate-pulse" />
                            <div className="h-5 w-3/4 bg-subtle animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-subtle animate-pulse" />
                                <div className="h-4 w-5/6 bg-subtle animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
