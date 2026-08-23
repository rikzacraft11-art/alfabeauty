"use client";

import * as React from "react";

/* ─────────────────────────────────────────────────────────────────────
 * Role Management & Access Control (Blueprint.md Bagian B1 & G)
 *
 * Supported Roles:
 * - "guest": Unauthenticated visitor (default)
 * - "consumer": Registered retail customer (email / OTP WhatsApp)
 * - "partner_pending": Partner applicant awaiting verification (SLA <= 4h)
 * - "salon_verified": Verified Salon & Barbershop partner (KTP + Salon photo verified)
 * - "distributor_verified": Verified Regional Distributor (NIB + NPWP verified)
 * ───────────────────────────────────────────────────────────────────── */

import { type UserRole, type RoleConfig, DEFAULT_ROLE_CONFIG } from "@/features/catalog/lib/role-pricing";

export type { UserRole, RoleConfig };

export interface UserProfile {
    name: string;
    email: string;
    businessName?: string;
    businessType?: "salon" | "barbershop" | "distributor" | "consumer";
    city?: string;
    pointsBalance: number;
    creditLimit?: number;
    usedCredit?: number;
    isVerified: boolean;
}

const DEFAULT_PROFILES: Record<UserRole, UserProfile> = {
    guest: {
        name: "Pengunjung",
        email: "",
        pointsBalance: 0,
        isVerified: false,
    },
    consumer: {
        name: "Jessica Pratama",
        email: "jessica.p@gmail.com",
        businessType: "consumer",
        city: "Jakarta Selatan",
        pointsBalance: 0,
        isVerified: true,
    },
    partner_pending: {
        name: "Budi Santoso",
        email: "budi@luxe-hair.com",
        businessName: "Luxe Hair Studio (Dalam Verifikasi)",
        businessType: "salon",
        city: "Surabaya",
        pointsBalance: 0,
        isVerified: false,
    },
    salon_verified: {
        name: "Rian Hidayat",
        email: "rian@alfa-salon.co.id",
        businessName: "Alfa Signature Salon & Spa",
        businessType: "salon",
        city: "Jakarta Pusat",
        pointsBalance: 125000,
        creditLimit: 25000000,
        usedCredit: 8500000,
        isVerified: true,
    },
    distributor_verified: {
        name: "PT Graha Kosmetika Sejahtera",
        email: "procurement@graha-kosmetika.com",
        businessName: "Graha Kosmetika (Distributor Jawa Timur)",
        businessType: "distributor",
        city: "Surabaya",
        pointsBalance: 850000,
        creditLimit: 150000000,
        usedCredit: 45000000,
        isVerified: true,
    },
};

interface RoleContextValue {
    role: UserRole;
    setRole: (role: UserRole) => void;
    user: UserProfile;
    updateUser: (updates: Partial<UserProfile>) => void;
    config: RoleConfig;
    updateConfig: (updates: Partial<RoleConfig>) => void;
    isGuest: boolean;
    isConsumer: boolean;
    isPartnerPending: boolean;
    isSalon: boolean;
    isDistributor: boolean;
    isPartner: boolean; // Verified salon or distributor
}

const RoleContext = React.createContext<RoleContextValue | null>(null);

const ROLE_STORAGE_KEY = "alfa_beauty_user_role";

export function RoleProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const [role, setRoleState] = React.useState<UserRole>("guest");
    const [user, setUser] = React.useState<UserProfile>(DEFAULT_PROFILES.guest);
    const [config, setConfig] = React.useState<RoleConfig>(DEFAULT_ROLE_CONFIG);
    const [mounted, setMounted] = React.useState(false);

    // Hydrate persisted role from localStorage safely on client
    React.useEffect(() => {
        try {
            const saved = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
            if (saved && DEFAULT_PROFILES[saved]) {
                setRoleState(saved);
                setUser(DEFAULT_PROFILES[saved]);
            }
        } catch {
            // Ignore storage errors in private browsing
        }
        setMounted(true);
    }, []);

    const setRole = React.useCallback((newRole: UserRole) => {
        setRoleState(newRole);
        setUser(DEFAULT_PROFILES[newRole]);
        try {
            localStorage.setItem(ROLE_STORAGE_KEY, newRole);
        } catch {
            // Ignore storage errors
        }
    }, []);

    const updateUser = React.useCallback((updates: Partial<UserProfile>) => {
        setUser((prev) => ({ ...prev, ...updates }));
    }, []);

    const updateConfig = React.useCallback((updates: Partial<RoleConfig>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
    }, []);

    const value = React.useMemo<RoleContextValue>(() => {
        return {
            role: mounted ? role : "guest",
            setRole,
            user,
            updateUser,
            config,
            updateConfig,
            isGuest: (mounted ? role : "guest") === "guest",
            isConsumer: (mounted ? role : "guest") === "consumer",
            isPartnerPending: (mounted ? role : "guest") === "partner_pending",
            isSalon: (mounted ? role : "guest") === "salon_verified",
            isDistributor: (mounted ? role : "guest") === "distributor_verified",
            isPartner: (mounted ? role : "guest") === "salon_verified" || (mounted ? role : "guest") === "distributor_verified",
        };
    }, [role, user, config, mounted, setRole, updateUser, updateConfig]);

    return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useUserRole(): RoleContextValue {
    const ctx = React.useContext(RoleContext);
    if (!ctx) {
        // Fallback for isolated SSR or tests
        return {
            role: "guest",
            setRole: () => {},
            user: DEFAULT_PROFILES.guest,
            updateUser: () => {},
            config: DEFAULT_ROLE_CONFIG,
            updateConfig: () => {},
            isGuest: true,
            isConsumer: false,
            isPartnerPending: false,
            isSalon: false,
            isDistributor: false,
            isPartner: false,
        };
    }
    return ctx;
}
