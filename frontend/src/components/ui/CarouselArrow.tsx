import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";

export interface CarouselArrowProps {
    direction: "left" | "right";
    onClick: () => void;
    visible: boolean;
    className?: string;
    ariaLabel?: string;
    topClassName?: string;
}

/**
 * CarouselArrow - Navigation button for carousel
 * Accessible with proper ARIA attributes
 */
export function CarouselArrow({ direction, onClick, visible, className, ariaLabel, topClassName }: CarouselArrowProps) {
    if (!visible) return null;

    const isLeft = direction === "left";
    const Icon = isLeft ? IconChevronLeft : IconChevronRight;
    const label = ariaLabel ?? (isLeft ? "Previous" : "Next");
    const position = isLeft ? "left-[-10px]" : "right-[-10px]";
    const top = topClassName ?? "top-1/3 -translate-y-1/2";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                absolute ${position} ${top} z-10
                flex items-center justify-center
                h-11 w-11
                rounded-full
                bg-background/[0.92] text-foreground
                shadow-md
                transition-all duration-200
                hover:scale-105 hover:opacity-100
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-foreground/60
                ${className ?? ""}
            `}
            aria-label={label}
        >
            <Icon className="h-5 w-5 block" />
        </button>
    );
}
