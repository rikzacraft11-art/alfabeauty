export type Audience = "SALON" | "BARBER";

export type Product = {
	slug: string;
	name: string;
	brand: string;
	audience: Audience[];
	functions: string[];
	categories?: string[];
	summary: string;
	benefits: string[];
	howToUse: string;
	image?: {
		url?: string;
	};
};

export type EducationEvent = {
	slug: string;
	title: string;
	brand: string;
	type: string;
	excerpt: string;
	date: string;
	city: string;
	audience: string[];
	cta_label?: string;
	body: string[];
};

export type EducationArticle = {
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	body: string[];
};

export type LeadRecord = {
	name: string;
	phone?: string;
	email?: string;
	message?: string;
	ip_address?: string;
	page_url_initial?: string;
	page_url_current?: string;
	raw?: Record<string, unknown>;
};
