import type { Dictionary } from "../types";

export const idDictionary: Dictionary = {
  common: {
    explore: "Jelajahi",
    learnMore: "Pelajari Lebih Lanjut",
    viewDetails: "Lihat Detail",
    contactUs: "Hubungi Kami",
    partnerWithUs: "Bermitra Dengan Kami",
    whatsappConsultation: "Konsultasi WhatsApp",
    since: "Sejak",
    yearsOfExperience: "Tahun Pengalaman",
    officialDistributor: "Distributor Resmi Nasional",
    bpomCertified: "Terdaftar Resmi BPOM",
    readMore: "Selengkapnya",
    close: "Tutup",
    search: "Cari Produk...",
    all: "Semua",
    loading: "Memuat...",
  },
  nav: {
    home: "Beranda",
    products: "Produk",
    brands: "Brand",
    education: "Edukasi",
    partnership: "Kemitraan",
    about: "Tentang",
    contact: "Kontak",
    faq: "Tanya Jawab",
    searchPlaceholder: "Cari produk, kategori, atau brand...",
    whatsappCTA: "Hubungi WhatsApp",
    menu: "Menu",
    quickLinks: "Tautan Cepat",
    categoryTitle: "Kategori Produk",
    brandTitle: "Brand Eksklusif",
    creditApplication: "Credit Application",
    partnerLogin: "Login",
    viewAllProducts: "Lihat Seluruh Katalog Produk",
    viewAllBrands: "Lihat Seluruh Portofolio Brand",
  },
  hero: {
    eyebrow: "BERDIRI SEJAK 2007",
    titleLine1: "Inovasi Rambut Global",
    titleLine2: "untuk Standar Salon",
    titleLine3: "Profesional Indonesia",
    description:
      "Importir dan distributor tunggal brand perawatan rambut profesional Italia dan Spanyol, melayani salon dan barber terkemuka di seluruh Indonesia.",
    exploreBrands: "JELAJAHI BRAND",
    partnerWithUs: "KEMITRAAN SALON",
  },
  shopCTA: {
    eyebrow: "STANDAR PROFESIONAL",
    heading:
      "Ciptakan standar keunggulan perawatan rambut di salon Anda. Wujudkan transformasi tak terlupakan bagi setiap klien.",
    ctaPrefix: "Jelajahi seluruh portofolio salon kami —",
    seeAllProducts: "LIHAT SEMUA PRODUK",
  },
  solutions: {
    badge: "Solusi",
    exploreSolution: "Jelajahi Solusi",
    viewDetails: "Lihat Detail",
    items: [
      {
        id: "rebonding",
        title: "Solusi Pelurusan & Rebonding",
        description:
          "Formula pelurusan presisi tinggi dengan pH controller eksklusif. Menghasilkan rambut lurus alami, berkilau, dan bebas frizzy.",
        href: "/products?category=treatments",
        bgImage: "/images/solutions/rebonding.jpg",
      },
      {
        id: "colouring",
        title: "Solusi Pewarnaan & Bleaching",
        description:
          "Teknologi micro-pigment Italia dengan botanical oil pelindung ikatan rambut. Warna kaya, intens, dan tahan lama.",
        href: "/products?category=hair-colour",
        bgImage: "/images/solutions/colouring.jpg",
      },
      {
        id: "barber",
        title: "Solusi Barber & Hardware Presisi",
        description:
          "Peralatan profesional motor digital 120.000 RPM dengan bilah titanium presisi untuk kebutuhan salon berkecepatan tinggi.",
        href: "/products?category=tools",
        bgImage: "/images/solutions/barber.jpg",
      },
    ],
  },
  shopByCategory: {
    title: "Kategori Produk",
    subtitle: "Semua kebutuhan terbaik untuk salon dan perawatan rambut profesional Anda.",
    viewAllProducts: "Lihat Semua Produk",
    shopNow: "Beli Sekarang",
    categories: [
      {
        id: "haircare",
        title: "Perawatan Rambut",
        href: "/products?category=care",
        image: "/images/categories/haircare.jpg",
      },
      {
        id: "color",
        title: "Pewarnaan & Bleaching",
        href: "/products?category=color",
        image: "/images/categories/color.jpg",
      },
      {
        id: "treatments",
        title: "Serum & Kulit Kepala",
        href: "/products?category=treatments",
        image: "/images/categories/treatments.jpg",
      },
      {
        id: "tools",
        title: "Penataan & Alat Salon",
        href: "/products?category=tools",
        image: "/images/categories/tools.jpg",
      },
    ],
  },
  infoSection: {
    eyebrow: "WARISAN PERUSAHAAN",
    heading: "Komitmen pada Keunggulan, Terus Berinovasi",
    description:
      "Formulasi perawatan rambut luar biasa adalah janji kami. Standar yang belum tercapai akan disempurnakan hingga sempurna.",
    aboutCTA: "Tentang PT Alfa Beauty",
    missionTitle: "Misi Kami",
    missionDesc:
      "Meningkatkan industri salon Indonesia melalui akses langsung ke brand profesional Eropa terverifikasi, edukasi teknis lanjutan, dan integritas produk tanpa kompromi.",
    visionTitle: "Visi Kami",
    visionDesc:
      "Menjadi ekosistem perawatan rambut profesional paling tepercaya di Indonesia, dikenal atas keunggulan teknis, pasokan andal, dan dedikasi pada pertumbuhan industri salon.",
  },
  customMaklon: {
    eyebrow: "FORMULASI KHUSUS & MAKLON OEM",
    heading:
      "Salon dan brand kecantikan terkemuka berinvestasi pada formulasi khusus. Wujudkan visi produk eksklusif Anda bersama kami.",
    seeAllProducts: "KONSULTASIKAN FORMULASI",
    ctaPrefix: "Wujudkan formula eksklusif salon Anda —",
    notSurePrefix: "Butuh konsultasi formulasi? ",
    notSureCTA: "Hubungi tim ahli kami.",
  },
  standardsSection: {
    eyebrow: "KEPATUHAN KETAT",
    heading: "Standar Kualitas & Regulasi Produk",
    description:
      "Mitra laboratorium kami di Eropa dan Indonesia menjunjung tinggi etika dan keselamatan, memastikan setiap produk salon memenuhi standar regulasi tertinggi.",
    items: [
      "Tersertifikasi Resmi BPOM RI",
      "Regulasi Kosmetik Uni Eropa No 1223/2009",
      "Sertifikasi Halal MUI / BPJPH",
      "Standar Manufaktur CPKB / GMP Kosmetik",
      "Manajemen Mutu ISO 9001:2015",
      "Uji Dermatologis Laboratorium Italia & Spanyol",
      "Formula Pelurusan Bebas Formaldehida",
      "Kepatuhan Internasional Bebas Uji Hewan (Cruelty-Free)",
    ],
  },
  marquee: {
    innovation: "Inovasi Global",
    education: "Edukasi Teknis",
    partnership: "Kemitraan Strategis",
    quality: "Kualitas Teruji BPOM",
    distribution: "Distribusi Nasional",
    excellence: "Standar Keunggulan",
    authenticity: "100% Produk Asli",
    growth: "Pertumbuhan Bisnis Salon",
    masterclass: "Pelatihan Masterclass",
    trust: "Integritas & Kepercayaan",
  },
  about: {
    eyebrow: "Tentang Alfa Beauty",
    headingLine1: "18+ Tahun Membangun",
    headingLine2: "Standar Keunggulan Industri",
    paragraph1:
      "PT Alfa Beauty Cosmetica adalah perusahaan distribusi produk perawatan rambut profesional terpercaya yang melayani salon dan barbershop di seluruh nusantara. Dengan pengalaman lebih dari 18 tahun, kami memegang hak distribusi eksklusif untuk merek-merek ternama dunia.",
    paragraph2:
      "Kami berperan sebagai jembatan strategis antara inovasi prinsipal internasional dan kebutuhan praktis industri salon lokal. Didukung oleh tim teknis dan sales yang andal, kami konsisten mengedukasi industri melalui pendekatan berbasis pengetahuan dan sertifikasi resmi.",
    statsYears: "Tahun Dedikasi & Pengalaman",
    statsBrands: "Brand Eksklusif Internasional",
    statsProvinces: "Provinsi Terjangkau di Indonesia",
    learnMoreCTA: "Pelajari Lebih Lanjut Tentang Kami",
    badgeText: "Mitra Distribusi Resmi Nasional",
    heritageWatermark: "WARISAN · KEUNGGULAN · INOVASI · KEMITRAAN",
  },
  brands: {
    eyebrow: "Portofolio Eksklusif",
    heading: "Brand Pilihan Dunia untuk Salon Anda",
    description:
      "Kami mengimpor langsung produk bersertifikasi resmi yang dirancang khusus untuk memenuhi standar ketat salon dan barber profesional.",
    viewPortfolio: "Lihat Semua Brand",
    exploreBrand: "Lihat Produk",
  },
  features: {
    eyebrow: "Peran Strategis Kami",
    headingLine1: "Lebih Dari Sekadar",
    headingLine2: "Perusahaan Distribusi",
    description:
      "Kami memposisikan diri sebagai mitra pertumbuhan strategis bagi salon dan barbershop di Indonesia, mengintegrasikan ketersediaan produk berkualitas dengan program edukasi teknis berstandar global.",
    capabilities: [
      "Menghubungkan inovasi formulasi global dengan karakter dan kebutuhan pasar lokal",
      "Membangun kredibilitas salon melalui sertifikasi teknis dan pelatihan berkelanjutan",
      "Mendukung pertumbuhan bisnis salon dan barbershop yang mandiri dan berkelanjutan",
    ],
    quote: "Kami percaya kesuksesan jangka panjang salon dibangun di atas fondasi pengetahuan teknis yang mendalam, bukan sekadar penjualan produk.",
    exploreCTA: "Eksplorasi Program Edukasi",
    badge: "Edukasi & Pelatihan Profesional",
    mediaLabel: "Akademi & Masterclass Nasional",
  },
  partnership: {
    eyebrow: "Kolaborasi Bisnis",
    heading: "Mengapa Bermitra Bersama Alfa Beauty",
    principalCard: {
      number: "01",
      eyebrow: "Untuk Prinsipal Internasional",
      title: "Ekspansi pasar yang terstruktur dan aman di Indonesia",
      benefits: [
        "Jaringan distribusi resmi yang menjangkau seluruh pulau besar di Indonesia",
        "Pemahaman mendalam mengenai regulasi BPOM dan dinamika pasar lokal",
        "Komitmen jangka panjang dalam membangun reputasi dan nilai brand Anda",
      ],
    },
    salonCard: {
      number: "02",
      eyebrow: "Untuk Salon & Barbershop Profesional",
      title: "Tingkatkan kelas dan kualitas layanan salon Anda",
      benefits: [
        "Jaminan 100% keaslian produk resmi impor dengan sertifikasi BPOM",
        "Akses eksklusif ke pelatihan teknik, tren warna, dan masterclass berkala",
        "Dukungan penetapan harga partner dan suplai barang yang konsisten",
      ],
    },
    becomePartnerCTA: "Daftar Menjadi Mitra Salon",
    consultWhatsApp: "Konsultasi Kemitraan via WhatsApp",
  },
  faq: {
    eyebrow: "Pusat Bantuan",
    heading: "Pertanyaan yang Sering Diajukan",
    description:
      "Temukan jawaban lengkap seputar keaslian produk, persyaratan kemitraan, program edukasi, dan jangkauan pengiriman kami.",
    items: [
      {
        question: "Brand apa saja yang didistribusikan secara resmi oleh Alfa Beauty?",
        answer:
          "PT Alfa Beauty Cosmetica merupakan importir dan distributor eksklusif untuk brand internasional terkemuka seperti Alfaparf Milano Professional, Farmavita, Montibello, CORE Japan, dan Gamma+ Professional.",
      },
      {
        question: "Bagaimana cara salon atau barbershop mendaftar menjadi mitra resmi?",
        answer:
          "Anda dapat mengisi formulir kemitraan di halaman Kemitraan atau langsung menghubungi tim kami melalui WhatsApp. Mitra resmi akan memperoleh harga khusus salon, prioritas suplai produk, dan akses pelatihan gratis.",
      },
      {
        question: "Apakah Alfa Beauty menyediakan program pelatihan teknis untuk staf salon?",
        answer:
          "Ya. Melalui Alfa Beauty Academy, kami menyediakan workshop teknis intensif yang mencakup teknik pewarnaan lanjutan, pemotongan, penataan rambut, perm modern, serta manajemen bisnis salon.",
      },
      {
        question: "Apakah seluruh produk yang dijual memiliki izin edar resmi BPOM?",
        answer:
          "Seluruh produk yang kami distribusikan 100% resmi terdaftar di BPOM dan diimpor langsung dari pabrik prinsipal di Italia, Spanyol, dan Jepang dengan dokumen legalitas lengkap.",
      },
      {
        question: "Bagaimana jangkauan pengiriman pesanan untuk wilayah di luar pulau Jawa?",
        answer:
          "Kami melayani pengiriman produk ke seluruh 34 provinsi di Indonesia dengan dukungan mitra logistik profesional guna memastikan produk tiba dengan aman dan tepat waktu.",
      },
    ],
  },
  certifications: {
    eyebrow: "Sertifikasi & Jaminan Resmi",
    items: [
      {
        label: "Terdaftar BPOM",
        description: "100% memiliki izin edar resmi Indonesia",
      },
      {
        label: "100% Produk Asli",
        description: "Impor langsung dari pabrik prinsipal",
      },
      {
        label: "Formula Italia & Spanyol",
        description: "Standar riset dan inovasi Eropa",
      },
      {
        label: "Teknologi Jepang",
        description: "Formulasi perm & perawatan presisi tinggi",
      },
      {
        label: "Uji Dermatologi",
        description: "Aman dan terbukti secara klinis",
      },
      {
        label: "Distributor Tunggal",
        description: "Hak distribusi resmi dan legal",
      },
    ],
  },
  preFooter: {
    eyebrow: "Siap Mengembangkan Salon Anda?",
    headingLine1: "Tingkatkan Kualitas Layanan",
    headingLine2: "Dengan Produk Standar Dunia",
    description:
      "Bergabunglah bersama ribuan salon dan barbershop profesional di seluruh Indonesia yang telah mempercayakan suplai dan edukasi mereka kepada Alfa Beauty.",
    exploreProducts: "Jelajahi Produk",
    becomePartner: "Daftar Kemitraan",
    ticker: [
      "Perawatan Rambut Profesional Italia & Spanyol",
      "Solusi Komprehensif Salon & Barbershop",
      "Distribusi Resmi Terdaftar BPOM",
      "Pengiriman Tepat Waktu Seluruh Indonesia",
      "Edukasi Teknis & Sertifikasi Masterclass",
    ],
  },
  footer: {
    taglineLine1: "Inovasi untuk Salon",
    taglineLine2: "& Profesional Barber.",
    pillars: {
      products: {
        title: "Produk Profesional",
        desc: "Koleksi produk perawatan, pewarnaan, dan styling rambut impor bersertifikasi resmi BPOM.",
      },
      education: {
        title: "Edukasi & Akademi",
        desc: "Pelatihan teknis berkelanjutan dan sertifikasi resmi untuk meningkatkan keahlian stylist salon.",
      },
      partnership: {
        title: "Kemitraan Bisnis",
        desc: "Dukungan suplai stabil, harga khusus B2B, dan konsultasi bisnis untuk mitra salon di seluruh Indonesia.",
      },
    },
    copyright: "PT Alfa Beauty Cosmetica. Hak Cipta Dilindungi Undang-Undang.",
    privacy: "Kebijakan Privasi",
    terms: "Syarat & Ketentuan",
    hours: "Pukul 09.00 – 17.00 WIB",
    days: "Senin – Jumat",
    note: "Sabtu, Minggu & Hari Libur Nasional — Tutup",
  },
  productDetail: {
    backToProducts: "Kembali ke Katalog Produk",
    officialGuarantee: "Jaminan Resmi Distributor 100% Asli",
    certifiedBPOM: "Tersertifikasi BPOM",
    italyImport: "Impor Resmi Eksklusif",
    inStock: "Stok Tersedia untuk Salon",
    brandLabel: "Merek",
    categoryLabel: "Kategori",
    sizeLabel: "Ukuran / Kemasan",
    productDetails: "Detail & Spesifikasi Produk",
    sections: {
      description: "Deskripsi Produk",
      howToUse: "Panduan Penggunaan Profesional",
      ingredients: "Formula & Kandungan Bahan Aktif",
      benefits: "Manfaat & Hasil Akhir Utama",
      technicalSpecs: "Spesifikasi Teknis & Legalitas BPOM",
    },
    pairWithTitle: "Kombinasi Penggunaan yang Disarankan",
    pairWithSubtitle: "Rangkaian produk pelengkap untuk hasil perawatan yang maksimal di salon Anda.",
    recommendedTitle: "Rekomendasi Produk Terkait",
    recommendedSubtitle: "Pilihan produk profesional lainnya dalam kategori yang sama.",
    consultSpecialist: "Konsultasi dengan Technical Specialist Kami",
    consultDesc: "Dapatkan panduan aplikasi teknis, penawaran harga khusus salon, dan ketersediaan stok melalui WhatsApp.",
    whatsappOrder: "Pesan / Konsultasi via WhatsApp",
  },
  educationPage: {
    eyebrow: "Alfa Beauty Academy",
    title: "Program Pelatihan & Sertifikasi Teknis",
    description: "Tingkatkan kompetensi dan kredibilitas stylist Anda melalui kurikulum edukasi berstandar internasional.",
    syllabusTitle: "Kurikulum & Modul Pelatihan",
    workshopsTitle: "Jadwal Workshop Mendatang",
    registerCTA: "Daftar Pelatihan Sekarang",
  },
  partnershipPage: {
    eyebrow: "Peluang Kemitraan",
    title: "Bermitra untuk Pertumbuhan Jangka Panjang",
    description: "Kami membuka pintu kolaborasi bagi salon, barbershop, dan prinsipal yang mengutamakan kualitas serta integritas.",
    formTitle: "Formulir Pendaftaran Kemitraan",
    formSubtitle: "Isi data salon atau instansi Anda dan tim representatif kami akan segera menghubungi Anda.",
  },
};
