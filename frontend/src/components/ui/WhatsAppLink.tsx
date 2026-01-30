"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface WhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    phone?: string;
    message?: string;
    prefill?: string; // Alias for message
    children?: React.ReactNode;
}

export default function WhatsAppLink({
    phone = "6281234567890", // Default number if not provided
    message,
    prefill,
    className,
    children,
    href, // Allow overriding href if needed
    ...props
}: WhatsAppLinkProps) {
    // Use provided phone or default env var/constant
    // Sanitize phone number to digits only
    const cleanPhone = phone.replace(/\D/g, "");

    const text = message || prefill || "";

    // Construct URL
    // Using universal link which works on both mobile and desktop
    const url = useMemo(() => {
        if (href) return href;
        const baseUrl = "https://wa.me/";
        const encodedText = text ? `?text=${encodeURIComponent(text)}` : "";
        return `${baseUrl}${cleanPhone}${encodedText}`;
    }, [href, cleanPhone, text]);

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("inline-flex items-center justify-center", className)}
            {...props}
        >
            {children || "Chat on WhatsApp"}
        </a>
    );
}
