import type { Product } from "../data/products";

export type { Product };

export interface CategoryTab {
    id: string;
    label: string;
    count?: number;
}

export interface FilterFacet {
    id: string;
    label: string;
    count: number;
}

export interface FilterSection {
    id: string;
    title: string;
    options: FilterFacet[];
}

export type SortOption = "latest" | "price-asc" | "price-desc" | "name-asc" | "popular";
