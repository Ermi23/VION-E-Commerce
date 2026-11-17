"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PLACEHOLDER_IMAGE, cloudinaryLoader, isCloudinary } from "@/lib/images";

interface Props {
  /** Image URL from the Sheet; undefined shows the placeholder. */
  src?: string;
  alt: string;
  /** How wide the image is on screen, e.g. "(min-width: 1024px) 25vw, 50vw". */
  sizes: string;
  /** Set for the first image(s) on the page; everything else lazy-loads. */
  eager?: boolean;
  className?: string;
}

/**
 * Fills its (position: relative) parent with a product photo.
 * - Cloudinary URLs go through the custom loader (f_auto, q_auto, right width).
 * - Any other URL is used as-is (`unoptimized`) — never Vercel optimisation.
 * - A missing or broken image falls back to the placeholder.
 */
export default function ProductImage({ src, alt, sizes, eager = false, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // An image can fail before React attaches onError; catch that case too.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  const usePlaceholder = !src || failed;
  const finalSrc = usePlaceholder ? PLACEHOLDER_IMAGE : src;
  const cloudinary = !usePlaceholder && isCloudinary(finalSrc);

  return (
    <Image
      ref={ref}
      src={finalSrc}
      alt={alt}
      fill
      sizes={sizes}
      loader={cloudinary ? cloudinaryLoader : undefined}
      unoptimized={!cloudinary}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
