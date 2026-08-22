/* ─────────────────────────────────────────────────────────────────────
 * Official Brand Ecosystem Data Layer (Color Theory & 9-Section PDP)
 * Models all 6 official portfolio & in-house brands with custom color
 * wheel palettes (custom canvas background, surface layers, and text tones),
 * brand-specific fonts, wordmark assets, certifications, 8-benefit breakdown,
 * lab specs, rituals, sustainability, testimonials, and masterclass articles.
 * ───────────────────────────────────────────────────────────────────── */

export type BrandTheme = {
    fontFamily: string; // e.g. "font-lexend", "font-sans"
    primaryColor: string; // Brand Primary Accent HEX
    accentColor: string; // Secondary Accent HEX
    bgCanvas: string; // Root Canvas background color
    bgCanvasGradient: string; // Rich Atmospheric background gradient
    bgSurface: string; // Surface / Card Background
    bgSurfaceHover: string;
    textPrimary: string; // Primary Heading / Body Text
    textSecondary: string; // Muted / Subtitle Text
    borderColor: string; // Default divider & card border
    borderHover: string; // Active hover border
    glowColor: string; // Radial Ambient Glow Color
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    wordmarkAsset: {
        light: string;
        colored: string;
        dark: string;
    };
};

export type BrandPillar = {
    title: string;
    description: string;
};

export type BrandCollection = {
    id: string;
    title: string;
    description: string;
    category: string;
};

export type BrandIngredient = {
    name: string;
    role: string;
    source: string;
    description: string;
};

export type BrandBenefit = {
    title: string;
    description: string;
    highlight: string;
};

export type BrandFAQ = {
    question: string;
    answer: string;
};

export type BrandRitualStep = {
    step: string;
    title: string;
    subtitle: string;
    description: string;
};

export type BrandTestimonial = {
    quote: string;
    author: string;
    role: string;
    salon: string;
    city: string;
    rating: number;
};

export type BrandArticle = {
    date: string;
    title: string;
    category: string;
    readTime: string;
    summary: string;
};

export type Brand = {
    slug: string;
    name: string;
    fullName: string;
    origin: string;
    originCountry: string;
    tagline: string;
    taglineId?: string;
    description: string;
    descriptionId?: string;
    story: string[];
    storyId?: string[];
    heroImage?: string;
    theme: BrandTheme;
    rating: {
        score: number;
        reviewCount: number;
    };
    logo: {
        light: string;
        dark: string;
        primary: string;
    };
    pillars: BrandPillar[];
    pillarsId?: BrandPillar[];
    collections: BrandCollection[];
    collectionsId?: BrandCollection[];
    keyIngredients: BrandIngredient[];
    keyIngredientsId?: BrandIngredient[];
    benefitAreas: BrandBenefit[];
    benefitAreasId?: BrandBenefit[];
    labSafety: {
        title: string;
        subtitle: string;
        manufacturer: string;
        standards: string[];
        description: string;
    };
    labSafetyId?: {
        title: string;
        subtitle: string;
        manufacturer: string;
        standards: string[];
        description: string;
    };
    faqs: BrandFAQ[];
    faqsId?: BrandFAQ[];
    ritual: BrandRitualStep[];
    ritualId?: BrandRitualStep[];
    sustainability: {
        title: string;
        tagline: string;
        description: string;
        features: string[];
    };
    sustainabilityId?: {
        title: string;
        tagline: string;
        description: string;
        features: string[];
    };
    testimonials: BrandTestimonial[];
    testimonialsId?: BrandTestimonial[];
    articles: BrandArticle[];
    articlesId?: BrandArticle[];
    legalInfo?: {
        manufacturer: string;
        bpomCertified: boolean;
        address: string;
    };
};

export const brands: Brand[] = [
    {
        slug: "smoovee",
        name: "SMOOVEE",
        fullName: "SMOOVEE Hair & Body Care",
        origin: "Gunung Putri, Bogor, Indonesia",
        originCountry: "Indonesia",
        tagline: "Modern Tropical Hair & Body Formulations",
        taglineId: "Formulasi Modern Perawatan Rambut & Tubuh Tropis Berstandar BPOM",
        description: "SMOOVEE blends hydrolyzed keratin science and precious botanical oils into salon-grade haircare and luxurious body fragrances crafted specifically for the tropical climate.",
        descriptionId: "SMOOVEE memadukan sains hydrolyzed keratin dengan minyak botani esensial ke dalam perawatan rambut salon dan wewangian tubuh mewah yang diformulasikan khusus untuk iklim tropis.",
        theme: {
            fontFamily: "font-lexend",
            primaryColor: "#C46D86", // Dusty Mauve Rose Pink
            accentColor: "#8C3D54", // Deep Rose Wine
            bgCanvas: "#FAF5F6", // Luminous Warm Rose Alabaster Canvas
            bgCanvasGradient: "linear-gradient(180deg, #FAF4F6 0%, #FFFFFF 30%, #F8EFF3 70%, #FAF4F6 100%)",
            bgSurface: "#FFFFFF",
            bgSurfaceHover: "#FCF6F8",
            textPrimary: "#1E1016", // Crisp Espresso Plum Noir
            textSecondary: "#5E4650", // Muted Warm Espresso Rose
            borderColor: "rgba(196, 109, 134, 0.18)",
            borderHover: "rgba(196, 109, 134, 0.45)",
            glowColor: "rgba(196, 109, 134, 0.12)",
            badgeBg: "rgba(196, 109, 134, 0.08)",
            badgeBorder: "rgba(196, 109, 134, 0.25)",
            badgeText: "#8C3D54",
            wordmarkAsset: {
                light: "/images/brands/smoovee/FINAL HAIRCARE/logo FINAL-08.png",
                colored: "/images/brands/smoovee/FINAL HAIRCARE/logo FINAL-07.png",
                dark: "/images/brands/smoovee/FINAL HAIRCARE/logo FINAL-06.png",
            }
        },
        rating: { score: 4.9, reviewCount: 128 },
        story: [
            "Born from a passion for accessible professional luxury, SMOOVEE Hair & Body Care was developed to provide salons and discerning individuals with high-efficacy keratin treatments and sensory fragrance rituals.",
            "Manufactured locally under stringent BPOM certification by PT Gemma Natura Lestari, every formula contains premium active ingredients including Hydrolyzed Keratin, Argan Oil, Meadowfoam Seed Oil, Squalane, and Ceramide NP.",
            "From intensive smoothing salon treatments to all-day hydrating body butters and mist fragrances, SMOOVEE redefines daily self-care with clean, dermatologically aligned excellence."
        ],
        storyId: [
            "Lahir dari komitmen menghadirkan kemewahan profesional yang terjangkau, SMOOVEE Hair & Body Care dikembangkan untuk memberikan salon dan pelanggan perawatan keratin berefikasi tinggi serta ritual wewangian sensoris.",
            "Diproduksi secara lokal dengan sertifikasi notifikasi BPOM resmi oleh PT Gemma Natura Lestari di Gunung Putri, Bogor, setiap formula memadukan bahan aktif terbaik seperti Hydrolyzed Keratin, Minyak Argan, Meadowfoam Seed Oil, Squalane, dan Ceramide NP.",
            "Mulai dari perawatan pelurusan rambut salon intensif hingga body butter dan mist fragrance yang menghidrasi seharian, SMOOVEE mendefinisikan ulang standar perawatan diri harian berkualitas tinggi."
        ],
        logo: {
            light: "/images/brands/smoovee/white SMOOVEE Hair & Body Care_LOGO.png",
            dark: "/images/brands/smoovee/black SMOOVEE Hair & Body Care_LOGO.png",
            primary: "/images/brands/smoovee/FINAL HAIRCARE/logo FINAL-07.png",
        },
        pillars: [
            {
                title: "BPOM Certified & Safe",
                description: "100% compliant with Indonesian cosmetic safety regulations with verified notification numbers for every batch."
            },
            {
                title: "Hydrolyzed Keratin Infusion",
                description: "Micro-keratin protein deeply penetrates the hair cortex to restore structural strength, smooth frizz, and impart lasting shine."
            },
            {
                title: "Tropical Climate Optimization",
                description: "Lightweight, non-greasy textures enriched with Ceramides and Squalane to lock in moisture against high humidity."
            },
            {
                title: "Signature Aromatherapy",
                description: "Four distinct fragrance profiles (Manika, Rimba, Sekar, Teduh) designed for lasting hair & body fragrance harmony."
            }
        ],
        pillarsId: [
            {
                title: "Tersertifikasi BPOM Resmi",
                description: "100% mematuhi regulasi keamanan kosmetik BPOM Indonesia dengan nomor notifikasi terdaftar untuk setiap batch produksi."
            },
            {
                title: "Infusi Hydrolyzed Keratin",
                description: "Protein mikro-keratin meresap ke korteks rambut untuk memperbaiki struktur, meredakan rambut mengembang, dan mengembalikan kilau alami."
            },
            {
                title: "Optimal untuk Iklim Tropis",
                description: "Tekstur ringan dan tidak lengket yang diperkaya Ceramide dan Squalane untuk mengunci kelembapan di tengah cuaca lembap."
            },
            {
                title: "Aromaterapi Eksklusif",
                description: "Empat profil aroma unik (Manika, Rimba, Sekar, Teduh) yang dirancang untuk kesegaran rambut dan tubuh sepanjang hari."
            }
        ],
        collections: [
            {
                id: "keratin-series",
                title: "Keratin Haircare Series",
                description: "Professional salon-grade shampoo, conditioner, mask, oil, and smoothing cream.",
                category: "hair-care"
            },
            {
                id: "hair-body-scent",
                title: "Hair & Body Scent Mists",
                description: "Refreshing deodorizing perfume mists in Manika, Rimba, Sekar, and Teduh.",
                category: "body-scent"
            },
            {
                id: "hand-body-butter",
                title: "Hand & Body Butters",
                description: "Ultra-nourishing Ceramide and Shea body moisturizers with signature fragrances.",
                category: "body-butter"
            }
        ],
        collectionsId: [
            {
                id: "keratin-series",
                title: "Lini Perawatan Keratin",
                description: "Shampoo, conditioner, masker, oil, dan krim pelurus rambut salon profesional.",
                category: "hair-care"
            },
            {
                id: "hair-body-scent",
                title: "Hair & Body Scent Mists",
                description: "Parfum mist penyegar rambut dan tubuh dalam varian Manika, Rimba, Sekar, dan Teduh.",
                category: "body-scent"
            },
            {
                id: "hand-body-butter",
                title: "Hand & Body Butter",
                description: "Pelembap tubuh kaya Ceramide dan Shea Butter dengan aroma khas yang menenangkan.",
                category: "body-butter"
            }
        ],
        keyIngredients: [
            {
                name: "Hydrolyzed Keratin",
                role: "Core Cuticle & Cortex Repair",
                source: "Bio-Fermented Peptide Synthesis",
                description: "Low-molecular weight protein that fills micro-fissures in damaged hair fibers for lasting structural integrity."
            },
            {
                name: "Argania Spinosa (Argan) Oil",
                role: "Thermal Shield & Mirror Luster",
                source: "Cold-Pressed Moroccan Argan Kernels",
                description: "Rich in Vitamin E and essential fatty acids, creating an ultra-lightweight non-occlusive protective lipid shield."
            },
            {
                name: "Ceramide NP & Squalane",
                role: "24H Cellular Moisture Lock",
                source: "Plant-Derived Biomimetic Lipids",
                description: "Reinforces skin and hair intercellular matrix to prevent trans-epidermal moisture loss in high humidity."
            },
            {
                name: "Meadowfoam Seed Oil",
                role: "Weightless Conditioning & Silk Softness",
                source: "Limnanthes Alba Seed Extract",
                description: "Remarkably stable antioxidant oil that lubricates hair strands and softens rough skin without buildup."
            }
        ],
        keyIngredientsId: [
            {
                name: "Hydrolyzed Keratin",
                role: "Perbaikan Inti Kutikula & Korteks",
                source: "Sintesis Peptida Bio-Fermentasi",
                description: "Protein berbobot molekul rendah yang mengisi celah mikro pada rambut rusak untuk kekuatan struktural jangka panjang."
            },
            {
                name: "Minyak Argan (Argania Spinosa)",
                role: "Proteksi Panas & Kilau Kaca",
                source: "Ekstrak Biji Argan Cold-Pressed",
                description: "Kaya akan Vitamin E dan asam lemak esensial yang membentuk pelindung lipid alami tanpa rasa lepek."
            },
            {
                name: "Ceramide NP & Squalane",
                role: "Pengunci Kelembapan 24 Jam",
                source: "Lipid Biomimetik Nabati",
                description: "Memperkuat matriks interselular kulit dan rambut untuk mencegah dehidrasi akibat cuaca panas dan paparan AC."
            },
            {
                name: "Meadowfoam Seed Oil",
                role: "Kelembutan Sutra Tanpa Residu",
                source: "Ekstrak Biji Limnanthes Alba",
                description: "Minyak antioksidan stabil tinggi yang melumasi helai rambut dan melembutkan kulit kering secara instan."
            }
        ],
        benefitAreas: [
            {
                title: "Intense Cuticle Smoothing",
                highlight: "Zero Frizz in 85%+ Humidity",
                description: "Eliminates frizz and creates disciplined, silky hair alignment even in tropical humid weather conditions."
            },
            {
                title: "Scalp Sebum & Dandruff Control",
                highlight: "Balanced Microbiome Action",
                description: "Cleanses excess scalp oils and flakes without stripping essential natural hydration."
            },
            {
                title: "Thermal & Color Defense",
                highlight: "230°C Heat Protection",
                description: "Shields delicate hair bonds against curling irons, flat irons, and bleaching oxidation."
            },
            {
                title: "24H Barrier Moisturization",
                highlight: "Ceramide NP Cellular Lock",
                description: "Deeply quenches dehydrated body skin, replenishing natural barrier lipids post-shower."
            },
            {
                title: "Long-Lasting Fine Fragrance",
                highlight: "8-12 Hour Odor Neutralizer",
                description: "Neutralizes environmental pollutants and cigarette/food odors on hair with fine fragrance mists."
            },
            {
                title: "Non-Greasy Rapid Absorption",
                highlight: "Velvet Matte Dry-Down",
                description: "Formulated specifically for tropical daily comfort with instant non-sticky absorption."
            },
            {
                title: "Salon Smoothing Enhancement",
                highlight: "Prolongs Treatment Longevity",
                description: "Extends the sleekness of professional salon smoothing and keratin services by up to 3 months."
            },
            {
                title: "Clean Dermatological Safety",
                highlight: "100% BPOM Verified",
                description: "Formulated free from parabens, harsh sulfates, and non-compliant chemical fillers."
            }
        ],
        benefitAreasId: [
            {
                title: "Pelurusan & Kehalusan Kutikula",
                highlight: "Bebas Kusut di Kelembapan 85%+",
                description: "Menghilangkan rambut mengembang dan membuat rambut jatuh disiplin serta lembut di iklim tropis."
            },
            {
                title: "Kontrol Minyak & Ketombe",
                highlight: "Aksi Penyeimbang Kulit Kepala",
                description: "Membersihkan kelebihan sebum dan serpihan ketombe tanpa mengikis kelembapan alami kulit kepala."
            },
            {
                title: "Proteksi Panas & Warna Rambut",
                highlight: "Perlindungan Panas Hingga 230°C",
                description: "Melindungi ikatan keratin rambut dari paparan catokan panas, hairdryer, dan oksidasi pewarnaan."
            },
            {
                title: "Hidrasi Kulit 24 Jam",
                highlight: "Pengunci Lipid Ceramide NP",
                description: "Menutrisi kulit tubuh yang kering dan bersisik, mengembalikan elastisitas dan kekenyalan kulit."
            },
            {
                title: "Aromaterapi Tahan Lama",
                highlight: "8-12 Jam Penetralisir Bau",
                description: "Menetralisir bau asap, matahari, dan polusi lingkungan pada rambut dengan semprotan parfum mist mewah."
            },
            {
                title: "Cepat Meresap & Tidak Lengket",
                highlight: "Sentuhan Akhir Beludru Ringan",
                description: "Diformulasikan khusus untuk kenyamanan iklim tropis dengan penyerapan instan tanpa rasa berminyak."
            },
            {
                title: "Perawatan Pasca-Salon Maksimal",
                highlight: "Memperpanjang Hasil Smoothing",
                description: "Mempertahankan hasil pelurusan salon dan keratin therapy hingga 3 bulan lebih lama."
            },
            {
                title: "Keamanan Dermatologi Bersih",
                highlight: "100% Terdaftar BPOM",
                description: "Bebas paraben, sulfat keras, dan bahan pengisi kimiawi berbahaya."
            }
        ],
        labSafety: {
            title: "Lab Tested with Intention. Encapsulated with Power.",
            subtitle: "PT Gemma Natura Lestari Certified Facility",
            manufacturer: "PT Gemma Natura Lestari (Gunung Putri, Bogor)",
            standards: [
                "BPOM Indonesian Cosmetic Notification Certified",
                "Good Manufacturing Practice (CPKB/GMP) Standard",
                "ISO 22716 Quality & Microbiological Testing",
                "Dermatologically Tested for Sensitive Tropical Skin"
            ],
            description: "Every single production batch undergoes rigorous 5-stage laboratory verification including heavy metal screening, microbiological stability, pH balance testing (pH 5.5 optimal for hair & skin), and thermal accelerated shelf-life verification."
        },
        labSafetyId: {
            title: "Uji Laboratorium Presisi. Diproduksi dengan Standar CPKB.",
            subtitle: "Fasilitas Bersertifikasi PT Gemma Natura Lestari",
            manufacturer: "PT Gemma Natura Lestari (Gunung Putri, Bogor)",
            standards: [
                "Tersertifikasi Nomor Notifikasi Resmi BPOM RI",
                "Standar Cara Pembuatan Kosmetika yang Baik (CPKB / GMP)",
                "Uji Stabilitas Mikrobiologis & Kualitas ISO 22716",
                "Teruji Secara Dermatologi untuk Kulit & Rambut Tropis"
            ],
            description: "Setiap batch produksi melewati 5 tahap verifikasi laboratorium independen meliputi uji skrining logam berat, stabilitas mikrobiologis, keseimbangan pH (pH 5.5 optimal), dan uji kestabilan suhu tropis."
        },
        faqs: [
            {
                question: "What makes SMOOVEE Keratin formulas ideal for tropical climates?",
                answer: "Unlike heavy Western keratin formulas that can weigh down hair in humid air, SMOOVEE uses lightweight hydrolyzed micro-keratin and non-occlusive Meadowfoam oil. It delivers intensive discipline and smoothing without any greasy residue."
            },
            {
                question: "Are all SMOOVEE products registered with BPOM?",
                answer: "Yes, 100% of SMOOVEE products are officially notified and certified by BPOM Indonesia through our manufacturing partner PT Gemma Natura Lestari in Gunung Putri, Bogor."
            },
            {
                question: "Can SMOOVEE Hair & Body Scent be used on colored or bleached hair?",
                answer: "Absolutely. The formula is alcohol-balanced and enriched with Aloe Vera, Collagen, and Argan Oil to condition hair strands while imparting a luxurious fragrance without stripping hair color."
            },
            {
                question: "How do I become an authorized salon stockist or wholesale distributor?",
                answer: "You can submit an inquiry through our Salon Partnership portal or contact our sales team directly via WhatsApp. We provide salon wholesale tiers, marketing collaterals, and staff product education."
            },
            {
                question: "How long does the smoothing effect of the Keratin Smoothing Cream last?",
                answer: "When applied professionally and maintained with SMOOVEE Keratin Shampoo and Conditioner, results typically last 8 to 12 weeks."
            }
        ],
        faqsId: [
            {
                question: "Apa yang membuat formula Keratin SMOOVEE sangat cocok untuk iklim tropis?",
                answer: "Berbeda dengan formula luar negeri yang sering kali terasa berat dan lepek di cuaca lembap, SMOOVEE menggunakan mikro-keratin terhidrolisis ringan dan Meadowfoam seed oil. Rambut menjadi jatuh lurus dan halus tanpa rasa berminyak."
            },
            {
                question: "Apakah seluruh produk SMOOVEE telah memiliki izin resmi BPOM?",
                answer: "Ya, 100% produk SMOOVEE telah memiliki nomor notifikasi resmi BPOM RI yang diproduksi oleh partner manufaktur kami PT Gemma Natura Lestari di Gunung Putri, Bogor."
            },
            {
                question: "Apakah Hair & Body Scent aman digunakan pada rambut yang diwarnai / bleaching?",
                answer: "Sangat aman. Formulanya diperkaya Aloe Vera, Kolagen, dan Minyak Argan yang menutrisi kutikula rambut sembari memberikan keharuman mewah tanpa memudarkan warna rambut."
            },
            {
                question: "Bagaimana cara salon bermitra dan membeli dengan harga grosir resmi?",
                answer: "Anda dapat mendaftar melalui form Kemitraan Salon kami atau menghubungi tim sales kami melalui WhatsApp untuk mendapatkan katalog harga grosir, tester produk, dan materi promosi salon."
            },
            {
                question: "Berapa lama ketahanan hasil Smoothing Cream Keratin SMOOVEE?",
                answer: "Dengan aplikasi profesional salon dan perawatan rutin menggunakan SMOOVEE Keratin Shampoo & Conditioner di rumah, hasil rambut lurus alami bertahan 8 hingga 12 minggu."
            }
        ],
        ritual: [
            {
                step: "01",
                title: "Purify & Prepare",
                subtitle: "Keratin Shampoo Cleansing",
                description: "Deeply cleanse the scalp of sebum and impurities while opening cuticle pathways to receive bio-active micro-keratin peptides."
            },
            {
                step: "02",
                title: "Restructure & Seal",
                subtitle: "Conditioner or Intensive Mask",
                description: "Infuse hydrolyzed keratin, Ceramide NP, and botanical oils into the cortex. Leave for 3-10 minutes to seal structural alignment."
            },
            {
                step: "03",
                title: "Shield & Fragrance",
                subtitle: "Keratin Oil + Hair & Body Scent",
                description: "Apply 1-2 drops of Keratin Oil for mirror glass shine and thermal defense, followed by a mist of signature Hair & Body Scent."
            }
        ],
        ritualId: [
            {
                step: "01",
                title: "Pembersihan Mendalam",
                subtitle: "Keratin Shampoo Cleansing",
                description: "Bersihkan kulit kepala dari minyak dan residu kotoran sembari membuka jalur kutikula untuk menyerap peptida mikro-keratin alami."
            },
            {
                step: "02",
                title: "Restrukturisasi & Nutrisi",
                subtitle: "Conditioner atau Hair Mask",
                description: "Resapkan hydrolyzed keratin, Ceramide NP, dan minyak botani ke batang rambut. Diamkan 3-10 menit untuk mengunci kelembutan dan kekuatan rambut."
            },
            {
                step: "03",
                title: "Kilau Kaca & Keharuman",
                subtitle: "Keratin Oil + Hair & Body Scent",
                description: "Aplikasikan 1-2 tetes Keratin Oil untuk kilau kaca instan dan proteksi catokan, diakhiri dengan semprotan Hair & Body Scent favorit Anda."
            }
        ],
        sustainability: {
            title: "Sustainable Packaging. Minimal Waste Philosophy.",
            tagline: "Salon Refill Ecosystem & Recyclable Materials",
            description: "We are committed to reducing single-use plastic waste across Indonesian salons through our high-capacity professional refill packs and 100% recyclable bottles.",
            features: [
                "High-Capacity 500ml & 1000ml Salon Backbar Refill Pouches",
                "100% Recyclable PET & Aluminum Containers",
                "Cruelty-Free, Paraben-Free, and Eco-Conscious R&D",
                "Locally Sourced & Manufactured to Minimize Carbon Logistics"
            ]
        },
        sustainabilityId: {
            title: "Kemasan Berkelanjutan. Komitmen Minim Sampah.",
            tagline: "Ekosistem Refill Salon & Material Daur Ulang",
            description: "Kami berkomitmen mengurangi limbah plastik sekali pakai di salon-salon Indonesia melalui kemasan isi ulang berkapasitas besar dan botol yang 100% dapat didaur ulang.",
            features: [
                "Kemasan Isi Ulang Salon Backbar 500ml & 1000ml",
                "Botol PET & Aluminium 100% Dapat Didaur Ulang",
                "Bebas Uji Hewan (*Cruelty-Free*) & Bebas Paraben",
                "Produksi Lokal di Bogor untuk Mengurangi Jejak Karbon Logistik"
            ]
        },
        testimonials: [
            {
                quote: "Perawatan Keratin SMOOVEE menjadi layanan paling diminati di salon kami. Klien sangat menyukai aromanya yang mewah dan rambut tetap terasa ringan tanpa rasa lepek sama sekali di cuaca Jakarta.",
                author: "Devi Anggraini",
                role: "Owner & Master Stylist",
                salon: "Luxe Studio Hair & Beauty",
                city: "Jakarta Selatan",
                rating: 5
            },
            {
                quote: "Hair & Body Scent varian Manika dan Sekar terjual habis setiap minggu di display kasir kami. Klien salon selalu membelinya sebagai parfum rambut wajib setelah blow dry!",
                author: "Budi Pratama",
                role: "Salon Director",
                salon: "The Atelier Haircare",
                city: "Surabaya",
                rating: 5
            },
            {
                quote: "Kualitas formulasi lokal berstandar BPOM dari PT Gemma Natura Lestari ini sangat membanggakan. Tekstur body butter-nya meresap cepat dan sangat melembapkan kulit ber-AC seharian.",
                author: "Siti Rahmawati",
                role: "Senior Colorist",
                salon: "Glow & Co Salon",
                city: "Bandung",
                rating: 5
            }
        ],
        articles: [
            {
                date: "22.08.26",
                category: "Masterclass",
                readTime: "4 min read",
                title: "Rahasia Perawatan Keratin Tahan Lama di Iklim Tropis",
                summary: "Pelajari bagaimana mikro-peptida keratin terhidrolisis melindungi ikatan disulfida rambut dari kelembapan udara tropis 85%+."
            },
            {
                date: "18.08.26",
                category: "Fragrance Ritual",
                readTime: "3 min read",
                title: "Harmoni 4 Aroma Khas: Manika, Rimba, Sekar, dan Teduh",
                summary: "Eksplorasi piramida aroma mewah yang memadukan wewangian botani lokal dengan keharuman modern khas salon internasional."
            },
            {
                date: "10.08.26",
                category: "Salon Business",
                readTime: "5 min read",
                title: "Meningkatkan Pendapatan Retail Salon dengan Produk Perawatan Tubuh",
                summary: "Bagaimana mengintegrasikan Hair & Body Scent dan Body Butter ke dalam pengalaman konsultasi kasir salon Anda."
            }
        ],
        legalInfo: {
            manufacturer: "PT Gemma Natura Lestari",
            bpomCertified: true,
            address: "Jl. Pancasila 1, Cicadas, Gunung Putri, Kab. Bogor, Jawa Barat - Indonesia"
        }
    },
    {
        slug: "alfaparf",
        name: "Alfaparf Milano",
        fullName: "Alfaparf Milano Professional",
        origin: "Milan, Italy",
        originCountry: "Italy",
        tagline: "The Italian House of Hair Color & Couture Care",
        taglineId: "Kemewahan Tata Rambut & Pewarnaan Otentik Milan",
        description: "The #1 Italian professional haircare brand worldwide, renowned for Evolution of the Color, Semi di Lino, and Keratin Therapy Lisse Design.",
        descriptionId: "Brand profesional nomor satu asal Italia yang mendunia, terkenal melalui pewarnaan Evolution of the Color, Semi di Lino, dan Keratin Therapy.",
        theme: {
            fontFamily: "font-sans",
            primaryColor: "#D4AF37", // Italian Champagne Gold
            accentColor: "#A6801E",
            bgCanvas: "#FAF8F5", // Luminous Warm Ivory Gold Canvas
            bgCanvasGradient: "linear-gradient(180deg, #FAF8F5 0%, #FFFFFF 35%, #F5F0E6 70%, #FAF8F5 100%)",
            bgSurface: "#FFFFFF",
            bgSurfaceHover: "#FCFAF6",
            textPrimary: "#1A1713",
            textSecondary: "#575147",
            borderColor: "rgba(212, 175, 55, 0.22)",
            borderHover: "rgba(212, 175, 55, 0.55)",
            glowColor: "rgba(212, 175, 55, 0.12)",
            badgeBg: "rgba(212, 175, 55, 0.08)",
            badgeBorder: "rgba(212, 175, 55, 0.3)",
            badgeText: "#8C6D14",
            wordmarkAsset: {
                light: "/images/brands/alfaparf-milano.webp",
                colored: "/images/brands/alfaparf-milano.webp",
                dark: "/images/brands/alfaparf-milano.webp",
            }
        },
        rating: { score: 4.9, reviewCount: 340 },
        story: [
            "Founded in 1980 in Milan, Alfaparf Milano Professional combines Italian taste, fine fashion sensibility, and cutting-edge biotechnology.",
            "As the exclusive distributor in Indonesia, PT Alfa Beauty Cosmetica equips top salons with the complete spectrum of Italian color artistry and restorative care."
        ],
        storyId: [
            "Didirikan pada tahun 1980 di Milan, Alfaparf Milano Professional menggabungkan cita rasa seni Italia, mode dunia, dan bioteknologi terdepan.",
            "Sebagai distributor eksklusif di Indonesia, PT Alfa Beauty Cosmetica mendukung salon terkemuka dengan portofolio pewarnaan dan perawatan rambut Italia terlengkap."
        ],
        logo: {
            light: "/images/brands/alfaparf-milano.webp",
            dark: "/images/brands/alfaparf-milano.webp",
            primary: "/images/brands/alfaparf-milano.webp",
        },
        pillars: [
            {
                title: "Italian Color Artistry",
                description: "Micro-pigmented formulas for luminous, multi-dimensional hair color results."
            },
            {
                title: "Semi di Lino Innovation",
                description: "Urban Defense Pro & Shine Fix complex protecting hair from environmental pollutants."
            }
        ],
        collections: [
            {
                id: "evolution-color",
                title: "Evolution of the Color",
                description: "Pioneering 3D coloring technology.",
                category: "hair-colour"
            },
            {
                id: "semi-di-lino",
                title: "Semi di Lino Treatments",
                description: "Diamond, Moisture, and Reconstruction regimens.",
                category: "treatments"
            }
        ],
        keyIngredients: [
            {
                name: "Linseed (Semi di Lino) Extract",
                role: "24H Luminous Cuticle Gloss",
                source: "Italian Flaxseed Bio-Extraction",
                description: "Rich in omega-3 and omega-6 fatty acids that seal the hair cuticle with mirror-like shine."
            },
            {
                name: "Urban Defense Pro",
                role: "Anti-Pollution Macromolecular Shield",
                source: "Biotechnological Sugar Macromolecules",
                description: "Protects the hair fiber from dust, smoke, and environmental heavy metals."
            }
        ],
        benefitAreas: [
            {
                title: "Multi-Dimensional 3D Color",
                highlight: "HCI Crystallized Micro-Pigments",
                description: "Ensures 100% grey coverage with unprecedented color depth and longevity."
            },
            {
                title: "Anti-Pollution Environmental Shield",
                highlight: "Urban Defense Pro Complex",
                description: "Blocks airborne particulate matter from dulling or oxidizing hair color."
            }
        ],
        labSafety: {
            title: "Italian Excellence & European Safety Standards",
            subtitle: "Formulated & Bottled in Milan, Italy",
            manufacturer: "Alfaparf Group S.p.A. (Bergamo & Milan, Italy)",
            standards: [
                "European Union Cosmetics Regulation (EC) No 1223/2009",
                "ISO 9001 & ISO 14001 Environmental Certified Manufacturing",
                "BPOM Indonesian Import Notification Registered"
            ],
            description: "Manufactured in state-of-the-art Italian laboratories with over 40 years of continuous dermatological validation."
        },
        faqs: [
            {
                question: "How long has Alfaparf Milano been distributed in Indonesia?",
                answer: "PT Alfa Beauty Cosmetica has been the official exclusive importer and distributor of Alfaparf Milano in Indonesia for over 18 years."
            }
        ],
        ritual: [
            {
                step: "01",
                title: "Illuminate & Cleanse",
                subtitle: "Semi di Lino Shampoo",
                description: "Wash gently to activate the Shine Fix complex and remove heavy metal buildup."
            },
            {
                step: "02",
                title: "Deep Reconstruct",
                subtitle: "Reparative Mask",
                description: "Apply bamboo marrow and cortex restructuring actives for 5-10 minutes."
            },
            {
                step: "03",
                title: "Cristalli Liquidi Finish",
                subtitle: "Liquid Crystal Serum",
                description: "Infuse instant diamond radiance with a few drops of Cristalli Liquidi."
            }
        ],
        sustainability: {
            title: "Sustainable Italian Production",
            tagline: "Renewable Energy & Recycled Packaging",
            description: "Alfaparf Milano production plants in Italy operate on 100% renewable electricity with PCR recycled plastic packaging.",
            features: [
                "100% Green Energy Manufacturing in Italy",
                "Post-Consumer Recycled (PCR) Plastic Bottles",
                "Biodegradable Botanical Active Sourcing"
            ]
        },
        testimonials: [
            {
                quote: "Alfaparf Evolution of the Color adalah standar emas pewarnaan di salon kami. Hasil warnanya selalu konsisten, kaya dimensi, dan tidak merusak batang rambut klien.",
                author: "Marcus Chen",
                role: "Creative Director",
                salon: "Avenue Hair Studio",
                city: "Jakarta Pusat",
                rating: 5
            }
        ],
        articles: [
            {
                date: "15.08.26",
                category: "Color Artistry",
                readTime: "5 min read",
                title: "Mastering Cool Brunettes with Evolution of the Color",
                summary: "Technical formulation guide for counteracting warm underlying pigments."
            }
        ]
    },
    {
        slug: "farmavita",
        name: "Farmavita",
        fullName: "Farmavita Professional",
        origin: "Milan, Italy",
        originCountry: "Italy",
        tagline: "Italian Scientific Formulations for Modern Salons",
        taglineId: "Formulasi Sains Italia untuk Salon Modern",
        description: "High-performance color, styling, and scalp therapy crafted with Mediterranean botanicals and keratin complexes.",
        descriptionId: "Pewarnaan, penataan, dan terapi kulit kepala berperforma tinggi dengan ekstrak botani Mediterania dan kompleks keratin.",
        theme: {
            fontFamily: "font-sans",
            primaryColor: "#2C5E55", // Mediterranean Emerald
            accentColor: "#1B403A",
            bgCanvas: "#F5FAF8", // Luminous Eucalyptus Mint Alabaster
            bgCanvasGradient: "linear-gradient(180deg, #F5FAF8 0%, #FFFFFF 35%, #ECF5F2 70%, #F5FAF8 100%)",
            bgSurface: "#FFFFFF",
            bgSurfaceHover: "#F7FCFA",
            textPrimary: "#111E1B",
            textSecondary: "#455C56",
            borderColor: "rgba(44, 94, 85, 0.2)",
            borderHover: "rgba(44, 94, 85, 0.5)",
            glowColor: "rgba(44, 94, 85, 0.12)",
            badgeBg: "rgba(44, 94, 85, 0.08)",
            badgeBorder: "rgba(44, 94, 85, 0.28)",
            badgeText: "#1B403A",
            wordmarkAsset: {
                light: "/images/brands/farmavita.webp",
                colored: "/images/brands/farmavita.webp",
                dark: "/images/brands/farmavita.webp",
            }
        },
        rating: { score: 4.8, reviewCount: 210 },
        story: [
            "With over 40 years of research in Milan, Farmavita delivers professional formulations trusted in over 70 countries worldwide.",
            "Featuring Life Color Plus with Brazil Nut extract and the revolutionary Omniplex bond-building technology."
        ],
        logo: {
            light: "/images/brands/farmavita.webp",
            dark: "/images/brands/farmavita.webp",
            primary: "/images/brands/farmavita.webp",
        },
        pillars: [
            {
                title: "Omniplex Bond Multiplier",
                description: "Rebuilds disulphide bonds during bleaching and chemical coloring."
            },
            {
                title: "Mediterranean Actives",
                description: "Nourishing oils and plant phytokeratins for intense scalp and hair vitality."
            }
        ],
        collections: [
            {
                id: "life-color-plus",
                title: "Life Color Plus",
                description: "Low ammonia professional permanent color.",
                category: "hair-colour"
            },
            {
                id: "bionature",
                title: "Bionature Scalp Care",
                description: "Organic trichological solutions for thinning and scalp care.",
                category: "hair-care"
            }
        ],
        keyIngredients: [
            {
                name: "Brazil Nut Oligopeptides",
                role: "Moisture Penetration & Color Binding",
                source: "Bertholletia Excelsa Seed Extract",
                description: "Low-molecular weight peptides that bond deeply into hair protein structure."
            }
        ],
        benefitAreas: [
            {
                title: "Low Ammonia Comfort",
                highlight: "Soothing Scalp Experience",
                description: "Formulated with soothing extracts for minimal scalp stinging during color application."
            }
        ],
        labSafety: {
            title: "Pharmaceutical-Grade Italian R&D",
            subtitle: "Milanese Trichological Research Facility",
            manufacturer: "Farmavita S.r.l. (Milan, Italy)",
            standards: ["EU Cosmetic Compliance", "ISO 9001", "BPOM RI Registered"],
            description: "Rigorous quality controls certified for salon safety across international health authorities."
        },
        faqs: [
            {
                question: "What is Omniplex technology?",
                answer: "Omniplex is a 2-step molecular bond builder that reconnects broken sulfur bonds during bleaching."
            }
        ],
        ritual: [
            {
                step: "01",
                title: "Bond Shield",
                subtitle: "Omniplex n.1 Bond Maker",
                description: "Mix directly into chemical formulas to prevent fiber damage."
            }
        ],
        sustainability: {
            title: "Eco-Conscious Mediterranean Botanicals",
            tagline: "Cruelty Free & Sustainable Harvesting",
            description: "Farmavita sustainably harvests plant actives from certified Mediterranean farms.",
            features: ["Sustainably Sourced Brazil Nut", "Recyclable Aluminum Tubes"]
        },
        testimonials: [
            {
                quote: "Life Color Plus memberikan kilau luar biasa pada rambut uban. Sangat lembut di kulit kepala klien sensitif.",
                author: "Irene Kusuma",
                role: "Salon Owner",
                salon: "Irene Hair Couture",
                city: "Semarang",
                rating: 5
            }
        ],
        articles: [
            {
                date: "05.08.26",
                category: "Scalp Health",
                readTime: "4 min read",
                title: "Treating Hair Loss with Bionature Organic Trichology",
                summary: "Essential oils and active plant botanicals for scalp micro-circulation."
            }
        ]
    },
    {
        slug: "montibello",
        name: "Montibello",
        fullName: "Montibello Barcelona",
        origin: "Barcelona, Spain",
        originCountry: "Spain",
        tagline: "Mediterranean Clean Beauty & Vegan Haircare",
        taglineId: "Kecantikan Bersih Mediterania & Perawatan Rambut Vegan",
        description: "Pioneering sustainable, vegan, and clean-beauty haircare solutions from the heart of Barcelona.",
        descriptionId: "Pelopor perawatan rambut berkelanjutan, vegan, dan clean-beauty dari pusat kota Barcelona, Spanyol.",
        theme: {
            fontFamily: "font-sans",
            primaryColor: "#C17C54", // Mediterranean Terracotta
            accentColor: "#8C4F2B",
            bgCanvas: "#FAF7F5", // Luminous Warm Terracotta Sand
            bgCanvasGradient: "linear-gradient(180deg, #FAF7F5 0%, #FFFFFF 35%, #F6ECE6 70%, #FAF7F5 100%)",
            bgSurface: "#FFFFFF",
            bgSurfaceHover: "#FCFAF8",
            textPrimary: "#201610",
            textSecondary: "#635046",
            borderColor: "rgba(193, 124, 84, 0.2)",
            borderHover: "rgba(193, 124, 84, 0.5)",
            glowColor: "rgba(193, 124, 84, 0.12)",
            badgeBg: "rgba(193, 124, 84, 0.08)",
            badgeBorder: "rgba(193, 124, 84, 0.28)",
            badgeText: "#8C4F2B",
            wordmarkAsset: {
                light: "/images/brands/montibello.webp",
                colored: "/images/brands/montibello.webp",
                dark: "/images/brands/montibello.webp",
            }
        },
        rating: { score: 4.9, reviewCount: 195 },
        story: [
            "Montibello creates salon products inspired by Mediterranean nature, featuring 90%+ natural origin ingredients in Decode Zero and Hop series.",
            "Combining high-performance hair aesthetics with rigorous environmental sustainability."
        ],
        logo: {
            light: "/images/brands/montibello.webp",
            dark: "/images/brands/montibello.webp",
            primary: "/images/brands/montibello.webp",
        },
        pillars: [
            {
                title: "Vegan & Clean Beauty",
                description: "Free from synthetic sulfates, silicones, and harsh chemical fillers."
            },
            {
                title: "Decode Zero Styling",
                description: "Invisible, natural hold styling that nourishes while sculpting."
            }
        ],
        collections: [
            {
                id: "decode-zero",
                title: "Decode Zero Clean Styling",
                description: "Pure plant-based styling and protective shields.",
                category: "styling"
            },
            {
                id: "hop-haircare",
                title: "Hop Biotechnology",
                description: "Advanced green science scalp and fiber treatments.",
                category: "hair-care"
            }
        ],
        keyIngredients: [
            {
                name: "Fermented Mediterranean Botanicals",
                role: "Green Biotechnology Strengthening",
                source: "Organic Spanish Farm Harvests",
                description: "Bio-fermented active compounds delivering 4x higher nutrient density."
            }
        ],
        benefitAreas: [
            {
                title: "Clean Plant Styling",
                highlight: "Zero Flaking & Residue",
                description: "Invisible plant polymers provide flexible memory hold with clean touchable texture."
            }
        ],
        labSafety: {
            title: "Clean Science & Vegan Certification",
            subtitle: "Barcelona Environmental Laboratory",
            manufacturer: "Cosmética Cosbar S.L. (Barcelona, Spain)",
            standards: ["V-Label European Vegan Certified", "Ecocert Standards", "BPOM Registered"],
            description: "Certified vegan, silicone-free, and dermatologically tested for delicate hair fibers."
        },
        faqs: [
            {
                question: "Is Decode Zero 100% vegan?",
                answer: "Yes, the Decode Zero range is officially certified vegan and contains up to 94% natural origin ingredients."
            }
        ],
        ritual: [
            {
                step: "01",
                title: "Cleanse with Hop",
                subtitle: "Hyper-Fermented Shampoo",
                description: "Purify hair fibers with antioxidant-rich botanical enzymes."
            }
        ],
        sustainability: {
            title: "Circular Eco-Design",
            tagline: "Ocean Bound Recycled Plastic",
            description: "100% recyclable bottles made from recycled coastal plastic waste.",
            features: ["Ocean Bound Recycled Packaging", "100% Vegan Formulas", "Carbon Neutral Facility"]
        },
        testimonials: [
            {
                quote: "Klien generasi muda kami sangat menyukai konsep clean beauty Montibello. Decode Zero memberikan tekstur styling yang sangat natural.",
                author: "Sarah Wijaya",
                role: "Master Stylist",
                salon: "Botanica Hair Salon",
                city: "Bali",
                rating: 5
            }
        ],
        articles: [
            {
                date: "01.08.26",
                category: "Clean Beauty",
                readTime: "3 min read",
                title: "Why Modern Salons are Transitioning to Vegan Styling",
                summary: "Sustainable plant polymers versus synthetic petrochemical silicones."
            }
        ]
    },
    {
        slug: "gamma-plus",
        name: "Gamma+",
        fullName: "Gamma+ Professional",
        origin: "Cazzago San Martino, Italy",
        originCountry: "Italy",
        tagline: "High-Performance Barber & Salon Electrical Engineering",
        taglineId: "Peralatan Elektronik Barber & Salon Berkecepatan Tinggi",
        description: "Italian mastercraft tools, magnetic motor clippers, and ultra-lightweight ionic hair dryers.",
        descriptionId: "Peralatan potong mastercraft Italia, clipper bermesin magnetik, dan pengering rambut ionik ultra-ringan.",
        theme: {
            fontFamily: "font-sans",
            primaryColor: "#D9403A", // Italian Precision Crimson
            accentColor: "#A6201B",
            bgCanvas: "#FAF6F6", // Luminous High-Precision Silver White
            bgCanvasGradient: "linear-gradient(180deg, #FAF6F6 0%, #FFFFFF 35%, #F6EDED 70%, #FAF6F6 100%)",
            bgSurface: "#FFFFFF",
            bgSurfaceHover: "#FCF8F8",
            textPrimary: "#1D1010",
            textSecondary: "#5E4646",
            borderColor: "rgba(217, 64, 58, 0.2)",
            borderHover: "rgba(217, 64, 58, 0.5)",
            glowColor: "rgba(217, 64, 58, 0.12)",
            badgeBg: "rgba(217, 64, 58, 0.08)",
            badgeBorder: "rgba(217, 64, 58, 0.28)",
            badgeText: "#A6201B",
            wordmarkAsset: {
                light: "/images/brands/gamma-plus.webp",
                colored: "/images/brands/gamma-plus.webp",
                dark: "/images/brands/gamma-plus.webp",
            }
        },
        rating: { score: 4.9, reviewCount: 420 },
        story: [
            "Gamma+ engineered the world's most powerful digital motor clippers (Absolute Hitter, Skin, Cyborg) and luxury quiet hairdryers (X-Cell).",
            "The benchmark choice for modern barbershops and elite styling salons globally."
        ],
        logo: {
            light: "/images/brands/gamma-plus.webp",
            dark: "/images/brands/gamma-plus.webp",
            primary: "/images/brands/gamma-plus.webp",
        },
        pillars: [
            {
                title: "Digital Magnetic Motors",
                description: "10,000+ RPM microchipped motors for precision fading and zero snagging."
            },
            {
                title: "Ultra-Lightweight Ergonomics",
                description: "Reduced wrist fatigue for salon and barber professionals."
            }
        ],
        collections: [
            {
                id: "clippers-trimmers",
                title: "Professional Clippers & Trimmers",
                description: "Cyborg, Absolute Hitter, and Skin finishing tools.",
                category: "tools"
            },
            {
                id: "dryers",
                title: "Ionic Hair Dryers",
                description: "X-Cell ultralight acoustic noise reduction dryers.",
                category: "tools"
            }
        ],
        keyIngredients: [
            {
                name: "DLC Black Diamond Carbon Blades",
                role: "Zero-Gap Fade Precision",
                source: "Precision Italian Metal Engineering",
                description: "Stays cooler, rust-free, and sharper up to 4x longer than standard stainless steel."
            }
        ],
        benefitAreas: [
            {
                title: "10,000 RPM Motor Power",
                highlight: "Zero Jamming in Dense Hair",
                description: "Effortlessly glides through bulk hair with digital torque compensation."
            }
        ],
        labSafety: {
            title: "Italian Precision Engineering Quality",
            subtitle: "Brescia Industrial Laboratory",
            manufacturer: "Gamma Più S.r.l. (Brescia, Italy)",
            standards: ["CE European Electrical Certification", "SNI Compliance", "1-Year Official Warranty"],
            description: "Precision balanced motors calibrated for 1,500+ hours of continuous barber use."
        },
        faqs: [
            {
                question: "Do Gamma+ clippers come with official Indonesian warranty?",
                answer: "Yes, all Gamma+ tools purchased through PT Alfa Beauty Cosmetica include an official 1-year warranty and authorized service support."
            }
        ],
        ritual: [
            {
                step: "01",
                title: "Bulk Removal",
                subtitle: "Cyborg Magnetic Clipper",
                description: "Debulk dense hair in a single effortless pass."
            }
        ],
        sustainability: {
            title: "Built to Last a Lifetime",
            tagline: "Modular Replaceable Components",
            description: "Gamma+ tools are engineered with modular parts to prevent electronic e-waste.",
            features: ["Replaceable Lithium-Ion Cells", "Interchangeable Custom Body Kits", "Low Energy Digital Inverters"]
        },
        testimonials: [
            {
                quote: "Gamma+ Absolute Hitter dan X-Cell dryer adalah senjata utama kami di barbershop. Sangat ringan dan motornya sangat bertenaga.",
                author: "Rizky Alamsyah",
                role: "Head Barber & Educator",
                salon: "Kingston Barber Studio",
                city: "Jakarta Barat",
                rating: 5
            }
        ],
        articles: [
            {
                date: "20.07.26",
                category: "Barber Engineering",
                readTime: "4 min read",
                title: "Why Magnetic Linear Motors are Replacing Rotary Clippers",
                summary: "Constant torque curves and thermal dissipation analysis in modern barbering."
            }
        ]
    },
    {
        slug: "core",
        name: "CORE",
        fullName: "CORE Chemical Engineering",
        origin: "Tokyo, Japan / Indonesia",
        originCountry: "Japan",
        tagline: "Japanese Chemical Engineering & Digital Perm Systems",
        taglineId: "Rekayasa Kimiawi Jepang & Sistem Digital Perm Profesional",
        description: "Precision chemical texturizing, Control Base porosity balancers, and advanced digital perm solutions.",
        descriptionId: "Teknologi pengkondisian kimiawi presisi, Control Base penyeimbang porositas, dan solusi digital perm.",
        theme: {
            fontFamily: "font-sans",
            primaryColor: "#0288D1", // Japanese Precision Tech Blue
            accentColor: "#01579B",
            bgCanvas: "#F5F9FC", // Luminous Titanium Oceanic Alabaster
            bgCanvasGradient: "linear-gradient(180deg, #F5F9FC 0%, #FFFFFF 35%, #EBF4F9 70%, #F5F9FC 100%)",
            bgSurface: "#FFFFFF",
            bgSurfaceHover: "#F7FBFE",
            textPrimary: "#0D1822",
            textSecondary: "#45596B",
            borderColor: "rgba(2, 136, 209, 0.2)",
            borderHover: "rgba(2, 136, 209, 0.5)",
            glowColor: "rgba(2, 136, 209, 0.12)",
            badgeBg: "rgba(2, 136, 209, 0.08)",
            badgeBorder: "rgba(2, 136, 209, 0.28)",
            badgeText: "#01579B",
            wordmarkAsset: {
                light: "/images/brands/core.webp",
                colored: "/images/brands/core.webp",
                dark: "/images/brands/core.webp",
            }
        },
        rating: { score: 4.8, reviewCount: 165 },
        story: [
            "CORE brings Japanese precision hair science into modern salon texturizing and perming rituals.",
            "Designed to protect the hair cortex during intensive heat and chemical wave restructuring."
        ],
        logo: {
            light: "/images/brands/core.webp",
            dark: "/images/brands/core.webp",
            primary: "/images/brands/core.webp",
        },
        pillars: [
            {
                title: "Porosity Equalization",
                description: "Control Base pre-treatment shields damaged hair zones from chemical over-processing."
            },
            {
                title: "Digital Heat Wave Elasticity",
                description: "Long-lasting bouncy curls with minimal cuticle swelling."
            }
        ],
        collections: [
            {
                id: "control-base",
                title: "Control Base System",
                description: "Pre-chemical and pre-color porosity equalization.",
                category: "treatments"
            }
        ],
        keyIngredients: [
            {
                name: "Alkali Buffer Complexes",
                role: "Cuticle Swelling Control",
                source: "Japanese Polymer Engineering",
                description: "Maintains optimal ionic pH balance during chemical restructuring."
            }
        ],
        benefitAreas: [
            {
                title: "Uniform Wave Elasticity",
                highlight: "Springy Bouncy Curls",
                description: "Prevents over-processing of porous ends while ensuring tight, defined wave formation."
            }
        ],
        labSafety: {
            title: "Japanese Chemical Safety Benchmarks",
            subtitle: "Formulated for Precision Salon Safety",
            manufacturer: "PT Alfa Beauty Cosmetica Partner Laboratories",
            standards: ["BPOM Registered", "Controlled pH Buffer Technology", "Salon Safety Tested"],
            description: "Engineered specifically to minimize odor and protect salon operator respiratory comfort."
        },
        faqs: [
            {
                question: "What is Control Base used for?",
                answer: "Control Base is a pre-treatment that equalizes hair porosity before perming, coloring, or smoothing."
            }
        ],
        ritual: [
            {
                step: "01",
                title: "Porosity Pre-Shield",
                subtitle: "Control Base Application",
                description: "Spray evenly on sensitized hair sections before chemical processing."
            }
        ],
        sustainability: {
            title: "Concentrated Professional Formulations",
            tagline: "Less Water Packaging, Maximum Yield",
            description: "High-concentration formulas engineered to reduce shipping weight and packaging volume.",
            features: ["High-Concentration Dosing", "Reduced Chemical Waste Footprint"]
        },
        testimonials: [
            {
                quote: "CORE Control Base adalah penyelamat kami saat menghadapi rambut klien yang rusak akibat bleaching tapi ingin dikeriting digital.",
                author: "Hendra Wijaya",
                role: "Technical Educator",
                salon: "Tokyo Hair Lounge",
                city: "Jakarta Barat",
                rating: 5
            }
        ],
        articles: [
            {
                date: "12.07.26",
                category: "Chemical Science",
                readTime: "5 min read",
                title: "Managing Hair Porosity Gradient in Asian Hair Texturizing",
                summary: "How alkali balancing prevents breakage during digital perm heat cycles."
            }
        ]
    }
];

export function getBrandBySlug(slug: string): Brand | undefined {
    return brands.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllBrandSlugs(): string[] {
    return brands.map((b) => b.slug);
}
