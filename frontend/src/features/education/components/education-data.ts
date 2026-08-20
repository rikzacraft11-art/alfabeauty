/* ─────────────────────────────────────────────────────────────────────
 * Education & Events — Shared Data Module
 *
 * Same pattern as product-data.ts:
 *   • Type definitions for Event and Article
 *   • Sample data (placeholder) for 10 events + 5 articles
 *   • Helper functions for data retrieval
 *
 * Source: reference.md §4.5, paket-a.md §4, content-priority-map.md
 * ───────────────────────────────────────────────────────────────────── */

import { SITE_SHORT_NAME, SITE_NAME } from "@/shared/lib/config";

// Re-export lightweight constants so existing server-side imports keep working
export { type EventType, eventTypeFilters, getEventTypeLabel } from "./education-constants";
import type { EventType } from "./education-constants";

export type EducationEvent = {
    id: string;
    title: string;
    type: EventType;
    brand: string;
    audience: "salon" | "barber" | "both";
    date: string; // ISO date string
    endDate?: string;
    location: string;
    description: string;
    longDescription: string;
    highlights: string[];
    instructor: string;
    duration: string;
    capacity: number;
    isUpcoming: boolean;
    isFeatured: boolean;
    relatedIds: string[];
};

export type Article = {
    id: string;
    title: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    excerpt: string;
    content: string;
    tags: string[];
};

/* ─── Sample Events (10 events — mix upcoming + past) ─── */

export const events: EducationEvent[] = [
    // Upcoming events
    {
        id: "alf-colour-masterclass-2026",
        title: "Alfaparf Milano Colour Masterclass",
        type: "masterclass",
        brand: "Alfaparf Milano",
        audience: "salon",
        date: "2026-04-15",
        endDate: "2026-04-16",
        location: "Jakarta",
        description:
            "Two-day intensive masterclass on advanced colour techniques with Alfaparf Milano's Evolution of the Color system.",
        longDescription:
            "Join our exclusive 2-day colour masterclass led by Alfaparf Milano's international education team. This intensive program covers advanced formulation techniques, creative colour placement, and the latest global colour trends adapted for Indonesian hair types. Participants will gain hands-on experience with the full Evolution of the Color range, including the latest Superméchès+ bleaching system. Each attendee receives a certificate of completion and exclusive product samples.",
        highlights: [
            "Advanced colour formulation techniques for Asian hair types",
            "Creative balayage and foil placement methods",
            "Colour correction and troubleshooting workshop",
            "Latest global colour trends with hands-on practice",
            "Certificate of completion from Alfaparf Milano",
        ],
        instructor: "International Education Team — Alfaparf Milano",
        duration: "2 days (09:00 – 17:00)",
        capacity: 30,
        isUpcoming: true,
        isFeatured: true,
        relatedIds: [
            "sdl-care-workshop-2026",
            "fv-colour-techniques-2026",
        ],
    },
    {
        id: "sdl-care-workshop-2026",
        title: "Semi di Lino Hair Care Workshop",
        type: "workshop",
        brand: "Alfaparf Milano",
        audience: "salon",
        date: "2026-05-08",
        location: "Surabaya",
        description:
            "Hands-on workshop exploring the complete Semi di Lino care range — from diagnosis to in-salon treatments.",
        longDescription:
            "Discover the science behind Alfaparf Milano's Semi di Lino range in this focused half-day workshop. Learn professional hair diagnosis techniques, understand the difference between Diamond, Moisture, and Reconstruction lines, and master in-salon treatment protocols. This workshop emphasizes practical skills that you can immediately implement in your salon to elevate client experience and drive repeat visits.",
        highlights: [
            "Professional hair and scalp diagnosis methodology",
            "Understanding the Semi di Lino Diamond, Moisture, and Reconstruction systems",
            "In-salon treatment protocols and timing",
            "Client consultation techniques for care programs",
        ],
        instructor: `${SITE_SHORT_NAME} Technical Team`,
        duration: "Half day (09:00 – 13:00)",
        capacity: 25,
        isUpcoming: true,
        isFeatured: false,
        relatedIds: [
            "alf-colour-masterclass-2026",
            "mb-clean-beauty-workshop-2026",
        ],
    },
    {
        id: "fv-colour-techniques-2026",
        title: "Farmavita Suprema Color Training",
        type: "training",
        brand: "Farmavita",
        audience: "salon",
        date: "2026-05-22",
        location: "Bandung",
        description:
            "Technical training on Farmavita's Suprema Color system — low-ammonia formulation and mixing ratios.",
        longDescription:
            "This training program focuses on Farmavita's Suprema Color professional colour line, known for its low-ammonia formulation and excellent grey coverage. Participants will learn precise mixing ratios, developer selection, processing times, and aftercare protocols. The session includes live demonstrations on models and hands-on practice for each attendee.",
        highlights: [
            "Suprema Color formulation and mixing mastery",
            "Developer selection and processing optimization",
            "Grey coverage techniques with low-ammonia formula",
            "Live demonstration on models",
        ],
        instructor: "Farmavita Indonesia Technical Educator",
        duration: "Full day (09:00 – 16:00)",
        capacity: 20,
        isUpcoming: true,
        isFeatured: false,
        relatedIds: [
            "alf-colour-masterclass-2026",
            "fv-scalp-treatment-2026",
        ],
    },
    {
        id: "gp-barber-tools-2026",
        title: "Gamma+ Barber Tools Masterclass",
        type: "masterclass",
        brand: "Gamma+ Professional",
        audience: "barber",
        date: "2026-06-10",
        location: "Jakarta",
        description:
            "Master the art of precision cutting and fading with Gamma+ Professional's advanced clipper and trimmer lineup.",
        longDescription:
            "Designed exclusively for barbers, this masterclass explores advanced techniques using Gamma+ Professional tools including the Absolute Hitter Clipper, Boosted Trimmer, and Ergo Shaver. Learn precision fading, detailed lining, and texture techniques from experienced barber educators. The session covers tool maintenance, blade calibration, and workflow optimization for busy barbershops.",
        highlights: [
            "Advanced fading techniques: skin fade, drop fade, taper fade",
            "Precision lining and detailing with zero-gap trimmers",
            "Tool maintenance: blade calibration, oiling, cord/cordless optimization",
            "Building efficient barbershop workflow",
            "Hands-on practice with the full Gamma+ product lineup",
        ],
        instructor: "Gamma+ Professional Education Team",
        duration: "Full day (10:00 – 17:00)",
        capacity: 20,
        isUpcoming: true,
        isFeatured: false,
        relatedIds: ["barber-business-workshop-2026"],
    },
    {
        id: "mb-clean-beauty-workshop-2026",
        title: "Montibello Decode Zero — Clean Beauty Workshop",
        type: "workshop",
        brand: "Montibello",
        audience: "salon",
        date: "2026-06-25",
        location: "Bali",
        description:
            "Explore Montibello's clean beauty philosophy through their sulphate-free, paraben-free Decode Zero range.",
        longDescription:
            "As consumer demand for clean, sustainable beauty grows, this workshop prepares salon professionals to meet that need. Explore Montibello's Decode Zero line — free from sulphates, parabens, and silicones — and learn how to position clean beauty services in your salon. The program covers ingredient education, client communication strategies, and practical application techniques for the Decode Zero haircare and styling range.",
        highlights: [
            "Understanding clean beauty: ingredients to avoid and why",
            "Decode Zero product range deep dive",
            "Client communication: positioning clean beauty services",
            "Application and styling techniques with clean formulas",
        ],
        instructor: "Montibello Indonesia Education Team",
        duration: "Half day (10:00 – 14:00)",
        capacity: 20,
        isUpcoming: true,
        isFeatured: false,
        relatedIds: ["sdl-care-workshop-2026"],
    },
    // Past events (track record)
    {
        id: "barber-business-workshop-2026",
        title: "Barbershop Business Workshop",
        type: "workshop",
        brand: "Gamma+ Professional",
        audience: "barber",
        date: "2026-02-05",
        location: "Jakarta",
        description:
            "Business fundamentals for barbershop owners — pricing, client retention, and team management.",
        longDescription:
            "This workshop goes beyond cutting techniques to focus on the business side of running a successful barbershop. Topics include pricing strategy, client retention, social media marketing, team building, and financial management. Designed for barbershop owners and senior barbers looking to grow their business.",
        highlights: [
            "Setting competitive pricing without undervaluing your craft",
            "Client retention strategies for repeat business",
            "Social media marketing for barbershops",
            "Team management and training culture",
        ],
        instructor: `Industry Guest Speaker + ${SITE_SHORT_NAME} Business Team`,
        duration: "Half day (13:00 – 17:00)",
        capacity: 30,
        isUpcoming: false,
        isFeatured: false,
        relatedIds: ["gp-barber-tools-2026"],
    },
    {
        id: "fv-scalp-treatment-2026",
        title: "Farmavita Scalp Treatment Certification",
        type: "training",
        brand: "Farmavita",
        audience: "both",
        date: "2026-01-20",
        location: "Surabaya",
        description:
            "Certified training on Farmavita's Tricogen scalp treatment protocol for hair loss prevention.",
        longDescription:
            "Become certified in Farmavita's professional scalp treatment protocol using the Tricogen Lotion system. This training covers scalp analysis, treatment application, and client consultation for hair loss concerns. Participants receive an official certification upon completion.",
        highlights: [
            "Professional scalp analysis techniques",
            "Tricogen treatment protocol mastery",
            "Client consultation for scalp and hair loss concerns",
            "Official Farmavita certification",
        ],
        instructor: "Farmavita Certified Trainer",
        duration: "Full day (09:00 – 16:00)",
        capacity: 15,
        isUpcoming: false,
        isFeatured: false,
        relatedIds: ["fv-colour-techniques-2026"],
    },
    {
        id: "alf-trend-collection-2025",
        title: "Alfaparf Trend Collection 2025 Showcase",
        type: "event",
        brand: "Alfaparf Milano",
        audience: "both",
        date: "2025-11-12",
        location: "Jakarta",
        description:
            "Exclusive showcase of Alfaparf Milano's 2025 trend collection featuring live demonstrations and styling shows.",
        longDescription:
            "An exclusive industry event showcasing Alfaparf Milano's latest trend collection. Featuring live hair shows, creative styling demonstrations, and a preview of upcoming product launches. This annual event brings together salon professionals, educators, and industry leaders for an inspiring evening of creative exchange.",
        highlights: [
            "Live hair show with international creative director",
            "2025 trend forecast and colour direction",
            "New product previews and launches",
            "Networking with industry professionals",
        ],
        instructor: "Alfaparf Milano Creative Director",
        duration: "Evening event (18:00 – 22:00)",
        capacity: 100,
        isUpcoming: false,
        isFeatured: false,
        relatedIds: ["alf-colour-masterclass-2026"],
    },
    {
        id: "mb-oalia-launch-2025",
        title: "Montibello Oalia Launch Training",
        type: "training",
        brand: "Montibello",
        audience: "salon",
        date: "2025-09-18",
        location: "Bandung",
        description:
            "Product launch and technical training for Montibello's revolutionary ammonia-free Oalia colour system.",
        longDescription:
            "Be among the first professionals in Indonesia to master Montibello's Oalia — a revolutionary ammonia-free permanent colour nourished with oils. This launch event combines product education with hands-on training, covering formulation, application, and the unique oil-based colour technology that sets Oalia apart.",
        highlights: [
            "Oalia oil-based colour technology explained",
            "Ammonia-free formulation and benefits",
            "Hands-on application with live models",
            "Exclusive launch pricing and salon starter kits",
        ],
        instructor: "Montibello Technical Team",
        duration: "Full day (09:00 – 16:00)",
        capacity: 25,
        isUpcoming: false,
        isFeatured: false,
        relatedIds: ["mb-clean-beauty-workshop-2026"],
    },
    {
        id: "gp-xcell-dryer-demo-2025",
        title: "Gamma+ XCell Dryer Live Demo",
        type: "event",
        brand: "Gamma+ Professional",
        audience: "both",
        date: "2025-08-05",
        location: "Jakarta",
        description:
            "Live demonstration of the Gamma+ XCell Dryer and its digital motor technology for professional stylists.",
        longDescription:
            "Experience the power of Gamma+ Professional's latest innovation — the XCell Dryer with digital motor technology. This demonstration event showcases the dryer's performance, lightweight design, and heat distribution. Open to all salon and barbershop professionals.",
        highlights: [
            "Digital motor technology explained",
            "Performance comparison with traditional dryers",
            "Styling techniques optimized for XCell airflow",
            "Trade show pricing available",
        ],
        instructor: "Gamma+ Product Specialist",
        duration: "Half day (10:00 – 14:00)",
        capacity: 40,
        isUpcoming: false,
        isFeatured: false,
        relatedIds: ["gp-barber-tools-2026"],
    },
];

/* ─── Sample Articles (5) ─── */

export const articles: Article[] = [
    {
        id: "understanding-professional-hair-colour",
        title: "Understanding Professional Hair Colour: A Guide for Salon Owners",
        category: "Product Knowledge",
        author: `${SITE_SHORT_NAME} Technical Team`,
        date: "2026-01-15",
        readTime: "6 min read",
        excerpt:
            "A comprehensive overview of professional hair colour systems — from permanent to semi-permanent — and how to choose the right system for your salon services.",
        content:
            "Professional hair colour is one of the most critical service categories in any salon. Understanding the difference between permanent, demi-permanent, and semi-permanent systems allows you to make informed decisions about your colour menu and inventory. Permanent colour systems like Alfaparf Milano's Evolution of the Color and Farmavita's Suprema Color provide maximum grey coverage and lasting results. They work by opening the hair cuticle and depositing colour into the cortex, offering the widest range of shades and the most predictable results. Semi-permanent options such as Alfaparf's Color Wear are ideal for clients seeking tone refresh without commitment. These deposit-only formulas are gentler, with no ammonia, making them perfect for clients who want to enhance their natural shade or add vibrancy between permanent colour appointments. When selecting a colour system for your salon, consider factors like your target clientele, the condition of hair types you commonly see, and the level of technical expertise your team possesses. A balanced colour menu typically includes a reliable permanent system, a demi-permanent option for toning and glazing, and a high-performance bleach system for lightening services.",
        tags: ["Hair Colour", "Product Knowledge", "Salon Management"],
    },
    {
        id: "barber-tool-maintenance-guide",
        title: "Essential Barber Tool Maintenance: Extending the Life of Your Equipment",
        category: "Technical Tips",
        author: `${SITE_SHORT_NAME} Technical Team`,
        date: "2026-01-08",
        readTime: "5 min read",
        excerpt:
            "Proper maintenance of clippers, trimmers, and shavers is crucial for consistent performance. Learn the essential daily and weekly maintenance routines.",
        content:
            "Your tools are your livelihood. A well-maintained clipper delivers a cleaner cut, lasts longer, and provides a better client experience. Here's a systematic approach to barber tool maintenance that every professional should follow. Daily maintenance should include brushing blade teeth after every client, applying 2-3 drops of clipper oil to the blade, and wiping down the housing with a disinfectant. This takes less than 30 seconds per tool but dramatically extends blade life. Weekly maintenance involves removing the blade assembly, deep cleaning with blade wash solution, inspecting for worn or damaged teeth, and checking the tension spring. For cordless tools like the Gamma+ Absolute Hitter and Boosted Trimmer, also check the charging contacts and battery performance. Blade alignment is critical for precision work. On a zero-gap trimmer like the Gamma+ Absolute Zero, the cutting blade should be set approximately 0.2mm behind the guard blade. This prevents cuts while maintaining the ability to achieve extremely close results. Replace blades when you notice pulling, uneven cutting, or increased heat generation during use. Most professional-grade blades last 3-6 months with proper care, depending on volume of clients.",
        tags: ["Barber", "Tool Maintenance", "Gamma+ Professional"],
    },
    {
        id: "clean-beauty-trend-salon",
        title: "The Clean Beauty Trend: What It Means for Your Salon",
        category: "Industry Trends",
        author: `${SITE_SHORT_NAME} Education Team`,
        date: "2025-12-20",
        readTime: "4 min read",
        excerpt:
            "Clean beauty is more than a buzzword — it's a growing consumer demand. Here's how salons can position themselves to meet this trend with the right product selections.",
        content:
            "The clean beauty movement has moved from niche to mainstream, and salon clients are increasingly asking about the ingredients in the products used on their hair. Understanding this trend and positioning your salon accordingly is no longer optional — it's a competitive advantage. Clean beauty in the professional context means products formulated without certain ingredients that consumers want to avoid: sulphates, parabens, silicones, and artificial fragrances. Montibello's Decode Zero line is an excellent example of a professional-grade clean beauty system that doesn't compromise on performance. For salon owners, adopting clean beauty doesn't mean replacing your entire product range overnight. Start by introducing one clean beauty option alongside your existing lines. Use it as an upsell opportunity — clients who care about clean beauty are typically willing to pay a premium for services that align with their values. Educate your team on ingredient awareness so they can confidently discuss product choices with clients. This positions your salon as knowledgeable and progressive, building trust and loyalty.",
        tags: ["Clean Beauty", "Industry Trends", "Montibello"],
    },
    {
        id: "scalp-health-salon-services",
        title: "Scalp Health: The Next Big Opportunity in Salon Services",
        category: "Service Development",
        author: `${SITE_SHORT_NAME} Technical Team`,
        date: "2025-11-30",
        readTime: "5 min read",
        excerpt:
            "Scalp treatments are one of the fastest-growing service categories in professional salons. Learn how to build a scalp health menu that drives repeat visits.",
        content:
            "Scalp health has become a major focus in the professional beauty industry, and for good reason. Healthy hair starts with a healthy scalp, and consumers are becoming increasingly aware of this connection. For salons, this represents a significant revenue opportunity. A professional scalp service menu might include: scalp analysis and consultation (using magnification tools), deep cleansing treatments for oily or congested scalps, hydrating treatments for dry or sensitive scalps, and intensive anti-hair-loss protocols. Farmavita's Tricogen Lotion system provides a proven framework for anti-hair-loss treatments. The protocol involves regular application combined with scalp massage to stimulate circulation and follicle health. When combined with Farmavita's Amethyste Purify Shampoo for oily scalps or Amethyste Hydrate for dry conditions, you create a comprehensive scalp care program. Scalp treatments are ideal for building recurring revenue because they require multiple sessions for visible results. A typical program runs 8-12 weeks, ensuring regular salon visits and increased product retail opportunities.",
        tags: ["Scalp Health", "Service Development", "Farmavita"],
    },
    {
        id: "building-salon-education-culture",
        title: "Building an Education Culture in Your Salon or Barbershop",
        category: "Business Growth",
        author: `${SITE_SHORT_NAME} Education Team`,
        date: "2025-11-15",
        readTime: "4 min read",
        excerpt:
            "Continuous education isn't just about learning new techniques — it's about building a team culture that attracts talent, retains clients, and drives business growth.",
        content:
            `The most successful salons and barbershops share a common trait: they invest consistently in education. This isn't just about sending your team to occasional workshops — it's about building a culture where learning is valued and rewarded. Start by setting an education calendar at the beginning of each year. Plan which trainings your team will attend, and communicate this as a benefit of working at your salon. Young stylists and barbers are attracted to businesses that invest in their growth. ${SITE_NAME} offers a range of education programs throughout the year, from technical colour trainings with Alfaparf Milano to business workshops for salon owners. Take advantage of these opportunities — many include certification that your team can display in the salon. Encourage knowledge sharing within your team. After someone attends a training, schedule a short internal session where they share what they learned with colleagues. This multiplies the educational investment and builds a collaborative team culture. Track the business impact of education: monitor service revenue before and after training attendance, client retention rates, and new service adoption. This data helps justify ongoing education investment and identifies which programs deliver the best ROI for your business.`,
        tags: ["Education", "Business Growth", "Team Development"],
    },
];

/* ─── Helper functions ─── */

export function getEventById(id: string): EducationEvent | undefined {
    return events.find((e) => e.id === id);
}

export function getArticleById(id: string): Article | undefined {
    return articles.find((a) => a.id === id);
}

export function getUpcomingEvents(): EducationEvent[] {
    return events.filter((e) => e.isUpcoming);
}

export function getPastEvents(): EducationEvent[] {
    return events.filter((e) => !e.isUpcoming);
}

export function getFeaturedEvent(): EducationEvent | undefined {
    return events.find((e) => e.isFeatured);
}

export function getAllEventIds(): string[] {
    return events.map((e) => e.id);
}

export function getAllArticleIds(): string[] {
    return articles.map((a) => a.id);
}

export function getRelatedEvents(event: EducationEvent): EducationEvent[] {
    return event.relatedIds
        .map((id) => events.find((e) => e.id === id))
        .filter((e): e is EducationEvent => e !== undefined)
        .slice(0, 3);
}


