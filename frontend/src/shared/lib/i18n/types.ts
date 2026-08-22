export type Language = "id" | "en";

export interface Dictionary {
  common: {
    explore: string;
    learnMore: string;
    viewDetails: string;
    contactUs: string;
    partnerWithUs: string;
    whatsappConsultation: string;
    since: string;
    yearsOfExperience: string;
    officialDistributor: string;
    bpomCertified: string;
    readMore: string;
    close: string;
    search: string;
    all: string;
    loading: string;
  };
  nav: {
    home: string;
    products: string;
    brands: string;
    education: string;
    partnership: string;
    about: string;
    contact: string;
    faq: string;
    searchPlaceholder: string;
    whatsappCTA: string;
    menu: string;
    quickLinks: string;
    categoryTitle: string;
    brandTitle: string;
    creditApplication: string;
    partnerLogin: string;
    viewAllProducts: string;
    viewAllBrands: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    description: string;
    exploreBrands: string;
    partnerWithUs: string;
  };
  shopCTA: {
    eyebrow: string;
    heading: string;
    ctaPrefix: string;
    seeAllProducts: string;
    notSurePrefix?: string;
    notSureCTA?: string;
  };
  solutions: {
    badge: string;
    exploreSolution: string;
    viewDetails: string;
    items: {
      id: string;
      title: string;
      description: string;
      href: string;
      bgImage: string;
    }[];
  };
  shopByCategory: {
    title: string;
    subtitle: string;
    viewAllProducts: string;
    shopNow: string;
    categories: {
      id: string;
      title: string;
      href: string;
      image: string;
    }[];
  };
  infoSection: {
    eyebrow: string;
    heading: string;
    description: string;
    aboutCTA: string;
    missionTitle: string;
    missionDesc: string;
    visionTitle: string;
    visionDesc: string;
  };
  customMaklon: {
    eyebrow: string;
    heading: string;
    seeAllProducts?: string;
    ctaPrefix?: string;
    notSurePrefix: string;
    notSureCTA: string;
  };
  standardsSection: {
    eyebrow: string;
    heading: string;
    description: string;
    items: string[];
  };
  marquee: {
    innovation: string;
    education: string;
    partnership: string;
    quality: string;
    distribution: string;
    excellence: string;
    authenticity: string;
    growth: string;
    masterclass: string;
    trust: string;
  };
  about: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    paragraph1: string;
    paragraph2: string;
    statsYears: string;
    statsBrands: string;
    statsProvinces: string;
    learnMoreCTA: string;
    badgeText: string;
    heritageWatermark: string;
  };
  brands: {
    eyebrow: string;
    heading: string;
    description: string;
    viewPortfolio: string;
    exploreBrand: string;
  };
  features: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    capabilities: string[];
    quote: string;
    exploreCTA: string;
    badge: string;
    mediaLabel: string;
  };
  partnership: {
    eyebrow: string;
    heading: string;
    principalCard: {
      number: string;
      eyebrow: string;
      title: string;
      benefits: string[];
    };
    salonCard: {
      number: string;
      eyebrow: string;
      title: string;
      benefits: string[];
    };
    becomePartnerCTA: string;
    consultWhatsApp: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    description: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  certifications: {
    eyebrow: string;
    items: {
      label: string;
      description: string;
    }[];
  };
  preFooter: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    exploreProducts: string;
    becomePartner: string;
    ticker: string[];
  };
  footer: {
    taglineLine1: string;
    taglineLine2: string;
    pillars: {
      products: { title: string; desc: string };
      education: { title: string; desc: string };
      partnership: { title: string; desc: string };
    };
    copyright: string;
    privacy: string;
    terms: string;
    hours: string;
    days: string;
    note: string;
  };
  productDetail: {
    backToProducts: string;
    officialGuarantee: string;
    certifiedBPOM: string;
    italyImport: string;
    inStock: string;
    brandLabel: string;
    categoryLabel: string;
    sizeLabel: string;
    productDetails: string;
    sections: {
      description: string;
      howToUse: string;
      ingredients: string;
      benefits: string;
      technicalSpecs: string;
    };
    pairWithTitle: string;
    pairWithSubtitle: string;
    recommendedTitle: string;
    recommendedSubtitle: string;
    consultSpecialist: string;
    consultDesc: string;
    whatsappOrder: string;
  };
  educationPage: {
    eyebrow: string;
    title: string;
    description: string;
    syllabusTitle: string;
    workshopsTitle: string;
    registerCTA: string;
  };
  partnershipPage: {
    eyebrow: string;
    title: string;
    description: string;
    formTitle: string;
    formSubtitle: string;
  };
}
