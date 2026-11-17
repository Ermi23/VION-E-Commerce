/** Formatting + link helpers. Safe to import from client components. */
import { shop } from "@/config/shop";
import type { Category, Gender, Product } from "./types";

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function formatPrice(price: number | null): string {
  return price === null ? "Ask for price" : `${shop.currency} ${numberFormat.format(price)}`;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  shoes: "Shoes",
  clothes: "Clothes",
};

export const GENDER_LABEL: Record<Gender, string> = {
  men: "Men",
  women: "Women",
  unisex: "Unisex",
  kids: "Kids",
};

/** Site address without a trailing slash; used for absolute links. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function productPath(id: string): string {
  return `/product/${encodeURIComponent(id)}`;
}

/**
 * Opens a Telegram chat with the shop, with the message already typed in.
 * Works with a phone number (t.me/+251…) or a username (t.me/name).
 */
export function telegramUrl(message?: string): string {
  const raw = shop.telegram.replace(/^(https?:\/\/)?t\.me\//i, "").replace(/^@/, "").trim();
  const isNumber = /^\+?[\d\s()-]+$/.test(raw);
  const target = isNumber ? `+${raw.replace(/\D/g, "")}` : encodeURIComponent(raw);
  return `https://t.me/${target}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function telUrl(): string {
  return `tel:${shop.phone.replace(/[^\d+]/g, "")}`;
}

/** The prefilled Telegram order message: product name, id and price (+ choices). */
export function orderMessage(
  product: Pick<Product, "id" | "name" | "price">,
  options: { size?: string; color?: string; link?: string } = {},
): string {
  const lines = [
    `Hello ${shop.name}! I would like to order:`,
    "",
    product.name,
    `Code: ${product.id}`,
    `Price: ${formatPrice(product.price)}`,
  ];
  if (options.size) lines.push(`Size: ${options.size}`);
  if (options.color) lines.push(`Colour: ${options.color}`);
  if (options.link) lines.push("", options.link);
  return lines.join("\n");
}

/** Short stock line for the product page. */
export function stockLabel(product: Pick<Product, "status" | "quantity">): string {
  if (product.status === "sold_out") return "Sold out";
  if (product.quantity !== null && product.quantity <= 3) return `Only ${product.quantity} left`;
  return "In stock";
}
