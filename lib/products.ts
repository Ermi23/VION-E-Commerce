/**
 * The ONLY module that knows where product data comes from.
 *
 * Today it reads a public Google Sheet as CSV. To move to another source
 * (a database, a CMS, a JSON file…) replace `loadRows()` and keep the
 * exported functions returning the same typed `Product` objects.
 *
 * Server-side only: never import this from a "use client" component.
 */
import Papa from "papaparse";
import { cache } from "react";
import { SAMPLE_CSV } from "./sample-data";
import type { Catalogue, Category, Gender, Product, ProductStatus } from "./types";

const REVALIDATE_SECONDS = 60;
const FETCH_TIMEOUT_MS = 10_000;

function sheetUrl(sheetId: string): string {
  // headers=1 tells Google that row 1 is always the header row.
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(
    sheetId,
  )}/gviz/tq?tqx=out:csv&sheet=Products&headers=1`;
}

/* ------------------------------------------------------------------ */
/* Loading                                                             */
/* ------------------------------------------------------------------ */

/** Accepts either the bare Sheet ID or the whole Sheet address pasted from the browser. */
function readSheetId(value: string | undefined): string {
  const text = (value ?? "").trim();
  const fromLink = text.match(/\/spreadsheets\/d\/([\w-]+)/);
  return fromLink ? fromLink[1] : text;
}

/** Returns the raw CSV text, or null when the Sheet cannot be read. */
async function loadCsv(): Promise<string | null> {
  const sheetId = readSheetId(process.env.SHEET_ID);

  if (!sheetId) {
    console.warn(
      "[products] SHEET_ID is not set — showing built-in demo products. Add SHEET_ID to .env.local (see .env.example).",
    );
    return SAMPLE_CSV;
  }

  try {
    const res = await fetch(sheetUrl(sheetId), {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[products] Google Sheet responded with HTTP ${res.status}.`);
      return null;
    }
    const text = await res.text();
    // A Sheet that is not shared publicly answers with an HTML sign-in page.
    if (/^\s*</.test(text)) {
      console.error(
        '[products] Google Sheet returned a web page instead of CSV. Is it shared as "Anyone with the link – Viewer"?',
      );
      return null;
    }
    return text;
  } catch (err) {
    console.error("[products] Could not fetch the Google Sheet:", err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Cleaning helpers — every one of these must tolerate any input       */
/* ------------------------------------------------------------------ */

const clean = (value: unknown): string =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

/** "Image URLs" → "image_urls", " Price " → "price". */
const normaliseHeader = (value: unknown): string =>
  clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

/** "Sold Out" / "sold-out" / "SOLD_OUT" → "sold_out". */
const keyword = (value: string): string =>
  value.toLowerCase().replace(/[^a-z]+/g, "_").replace(/^_+|_+$/g, "");

function parseCategory(value: string): Category | null {
  const k = keyword(value);
  if (["shoes", "shoe", "footwear", "sneakers", "sneaker"].includes(k)) return "shoes";
  if (["clothes", "cloth", "clothing", "apparel", "wear"].includes(k)) return "clothes";
  return null;
}

function parseGender(value: string): Gender | null {
  const k = keyword(value);
  if (["men", "man", "male", "mens", "men_s"].includes(k)) return "men";
  if (["women", "woman", "female", "womens", "women_s", "ladies"].includes(k)) return "women";
  if (["kids", "kid", "children", "child", "boys", "girls"].includes(k)) return "kids";
  if (["unisex", "all", "both"].includes(k)) return "unisex";
  return null;
}

/** Empty or unknown → "available", as the brief requires. */
function parseStatus(value: string): ProductStatus | "hidden" {
  const k = keyword(value);
  if (["sold_out", "soldout", "sold", "out_of_stock"].includes(k)) return "sold_out";
  if (["hidden", "hide", "draft"].includes(k)) return "hidden";
  return "available";
}

/** "2,500", "ETB 2500", "2500.50" → number. Anything else → null. */
function parseNumber(value: string): number | null {
  const digits = value.replace(/[^0-9.]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function parseList(value: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of value.split(/[,;\n]/)) {
    const item = clean(part);
    const key = item.toLowerCase();
    if (item && !seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

/**
 * Splits the image cell on commas / spaces / new lines, but only where a new
 * URL starts — Cloudinary URLs may contain commas themselves (f_auto,q_auto).
 */
function parseImages(value: string): string[] {
  return value
    .split(/[\s,;]+(?=https?:\/\/)/i)
    .map((part) => part.trim().replace(/[,;]+$/, ""))
    .filter((part) => {
      try {
        const url = new URL(part);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    });
}

const parseYes = (value: string): boolean =>
  ["yes", "y", "true", "1", "featured"].includes(keyword(value));

/* ------------------------------------------------------------------ */
/* CSV → Product[]                                                     */
/* ------------------------------------------------------------------ */

function parseCatalogue(csv: string): Product[] {
  const parsed = Papa.parse<string[]>(csv, { skipEmptyLines: "greedy" });
  const [headerRow, ...rows] = parsed.data;
  if (!headerRow) return [];

  const headers = headerRow.map(normaliseHeader);
  const products: Product[] = [];
  const seenIds = new Set<string>();

  rows.forEach((cells, index) => {
    const rowNumber = index + 2; // the row number the owner sees in the Sheet
    try {
      const row: Record<string, string> = {};
      let description = "";
      headers.forEach((header, i) => {
        if (header) row[header] = clean(cells[i]);
        // Keep line breaks in the description so paragraphs survive.
        if (header === "description" && typeof cells[i] === "string") {
          description = cells[i].replace(/\r\n?/g, "\n").trim();
        }
      });
      const get = (...names: string[]) => {
        for (const name of names) if (row[name]) return row[name];
        return "";
      };

      const id = get("id");
      const name = get("name");
      if (!id || !name) {
        console.warn(`[products] Skipping Sheet row ${rowNumber}: missing ${!id ? "id" : "name"}.`);
        return;
      }
      const idKey = id.toLowerCase();
      if (seenIds.has(idKey)) {
        console.warn(`[products] Skipping Sheet row ${rowNumber}: id "${id}" is used more than once.`);
        return;
      }
      seenIds.add(idKey);

      const status = parseStatus(get("status"));
      if (status === "hidden") return;

      const quantity = parseNumber(get("quantity", "qty", "stock"));

      products.push({
        id,
        name,
        category: parseCategory(get("category")),
        gender: parseGender(get("gender")),
        price: parseNumber(get("price")),
        sizes: parseList(get("sizes", "size")),
        colors: parseList(get("colors", "colours", "color", "colour")),
        quantity: quantity === null ? null : Math.floor(quantity),
        // A product marked available but with 0 in stock is sold out.
        status: quantity === 0 ? "sold_out" : status,
        images: parseImages(get("image_urls", "image_url", "images", "image")),
        description,
        featured: parseYes(get("featured")),
      });
    } catch (err) {
      console.warn(`[products] Skipping Sheet row ${rowNumber}: could not be read.`, err);
    }
  });

  return products;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** All visible products. Never throws. Deduplicated per request. */
export const getCatalogue = cache(async (): Promise<Catalogue> => {
  const csv = await loadCsv();
  if (csv === null) return { products: [], ok: false };
  try {
    return { products: parseCatalogue(csv), ok: true };
  } catch (err) {
    console.error("[products] Could not parse the Sheet:", err);
    return { products: [], ok: false };
  }
});

/** Finds one visible product by id (case-insensitive). */
export function findProduct(products: Product[], id: string): Product | undefined {
  const key = id.trim().toLowerCase();
  return products.find((p) => p.id.toLowerCase() === key);
}

export const isSoldOut = (product: Product): boolean => product.status === "sold_out";

/** Available products first, sold-out after — otherwise keeps the given order. */
export function availableFirst(products: Product[]): Product[] {
  return [
    ...products.filter((p) => !isSoldOut(p)),
    ...products.filter((p) => isSoldOut(p)),
  ];
}

const LETTER_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "XXXL", "3XL"];

/** Every size used by the given products: numbers ascending, then S/M/L…, then the rest. */
export function collectSizes(products: Product[]): string[] {
  const byKey = new Map<string, string>();
  for (const p of products) {
    for (const size of p.sizes) {
      const key = size.toLowerCase();
      if (!byKey.has(key)) byKey.set(key, size);
    }
  }
  const rank = (size: string): [number, number] => {
    const n = Number(size);
    if (Number.isFinite(n)) return [0, n];
    const letter = LETTER_SIZES.indexOf(size.toUpperCase());
    return letter >= 0 ? [1, letter] : [2, 0];
  };
  return [...byKey.values()].sort((a, b) => {
    const [groupA, orderA] = rank(a);
    const [groupB, orderB] = rank(b);
    return groupA - groupB || orderA - orderB || a.localeCompare(b);
  });
}
