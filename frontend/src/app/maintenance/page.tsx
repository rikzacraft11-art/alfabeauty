import React from "react";

export const metadata = {
    title: "Under Maintenance - Alfa Beauty Cosmetica",
    description: "We are currently performing scheduled maintenance.",
};

export default function MaintenancePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
            <div className="max-w-md space-y-6">
                <h1 className="type-h1 text-foreground">
                    System Maintenance
                </h1>
                <p className="type-body text-foreground/70">
                    Our system is currently undergoing scheduled maintenance to improve your experience.
                    <br />
                    We will be back shortly.
                </p>
                <div className="rounded-lg bg-panel p-4 border border-border">
                    <p className="type-data text-foreground/50">
                        Status: <span className="type-data-strong text-warning">MAINTENANCE_MODE</span>
                    </p>
                </div>
                <p className="type-legal text-foreground/40">
                    If you need urgent assistance, please contact your account manager.
                </p>
            </div>
        </div>
    );
}
