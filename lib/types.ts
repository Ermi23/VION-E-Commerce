export type Category = "shoes" | "clothes";
export type Gender = "men" | "women" | "unisex" | "kids";

/** Statuses a visitor can ever see. "hidden" rows never leave lib/products.ts. */
export type ProductStatus = "available" | "sold_out";

export interface Product {
  /** Unique code from the Sheet, e.g. "SH-001". Used in the product URL. */
  id: string;
  name: string;
  /** null when the Sheet cell is empty or not recognised. */
  category: Category | null;
  gender: Gender | null;
  /** null when the price cell is empty or not a number ("Ask for price"). */
  price: number | null;
  sizes: string[];
  colors: string[];
  /** null when the quantity cell is empty or not a number. */
  quantity: number | null;
  status: ProductStatus;
  /** Valid image URLs only; may be empty (a placeholder is shown). */
  images: string[];
  description: string;
  featured: boolean;
}

export interface Catalogue {
  /** Visible products (hidden rows removed), in Sheet order. */
  products: Product[];
  /** false when the Sheet could not be read — show the "being updated" notice. */
  ok: boolean;
}
