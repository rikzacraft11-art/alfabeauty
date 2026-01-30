export type Locale = "en" | "id";
export type ServiceId = string;

export interface Service {
    id: ServiceId;
    name: Record<Locale, string>;
    tagline: Record<Locale, string>;
    description: Record<Locale, string>;
    cta: {
        label: Record<Locale, string>;
        url: string;
    };
    image?: string;
    video?: {
        mp4?: string;
        webm?: string;
        poster?: string;
    };
}
