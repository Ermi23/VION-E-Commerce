/** Image helpers. Safe to import from client components (no secrets, no fetching). */

export const PLACEHOLDER_IMAGE = "/placeholder.svg";

/** True for Cloudinary delivery URLs we can add transformations to. */
export function isCloudinary(src: string): boolean {
  return /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(src);
}

function withTransform(src: string, transform: string): string {
  return src.replace("/image/upload/", `/image/upload/${transform}/`);
}

/**
 * Custom next/image loader: asks Cloudinary for the best format and quality
 * at exactly the width the device needs. No Vercel image optimisation involved.
 */
export function cloudinaryLoader({ src, width }: { src: string; width: number }): string {
  return withTransform(src, `f_auto,q_auto,c_limit,w_${width}`);
}

/** 1200×630 JPEG for Open Graph / Telegram link previews. */
export function ogImage(src: string | undefined): string | undefined {
  if (!src) return undefined;
  return isCloudinary(src) ? withTransform(src, "f_jpg,q_auto,c_fill,g_auto,w_1200,h_630") : src;
}
