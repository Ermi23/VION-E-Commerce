import Link from "next/link";
import type { CSSProperties } from "react";
import { CATEGORY_LABEL, GENDER_LABEL, formatPrice, productPath } from "@/lib/format";
import type { Product } from "@/lib/types";
import ProductImage from "./ProductImage";

interface Props {
  product: Product;
  /** Position in the grid: drives the stagger delay and eager loading. */
  index: number;
}

export default function ProductCard({ product, index }: Props) {
  const soldOut = product.status === "sold_out";
  const lowStock = !soldOut && product.quantity !== null && product.quantity <= 3;
  const meta = [
    product.category ? CATEGORY_LABEL[product.category] : null,
    product.gender ? GENDER_LABEL[product.gender] : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="stagger" style={{ "--i": index } as CSSProperties}>
      <Link
        href={productPath(product.id)}
        className="group block rounded-2xl focus-visible:outline-offset-4"
        aria-label={`${product.name}, ${formatPrice(product.price)}${soldOut ? ", sold out" : ""}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            eager={index < 2}
            className={`transition duration-700 ease-out-soft group-hover:scale-105 ${
              soldOut ? "opacity-50 grayscale" : ""
            }`}
          />
          {soldOut ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-ink px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-paper">
              Sold out
            </span>
          ) : lowStock ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-ember px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white">
              Only {product.quantity} left
            </span>
          ) : null}
          <span
            aria-hidden
            className="absolute inset-x-2.5 bottom-2.5 hidden translate-y-3 items-center justify-center rounded-full bg-card/95 py-2.5 text-sm font-semibold opacity-0 shadow-sm backdrop-blur transition duration-300 ease-out-soft group-hover:translate-y-0 group-hover:opacity-100 md:flex"
          >
            {soldOut ? "View details" : "View & order"}
          </span>
        </div>
        <div className="px-0.5 pb-1 pt-3">
          {meta && <p className="text-xs text-muted">{meta}</p>}
          <h3 className="mt-0.5 line-clamp-2 font-sans text-[0.95rem] font-medium leading-snug tracking-normal">
            {product.name}
          </h3>
          <p className={`mt-1 text-[0.95rem] font-semibold ${soldOut ? "text-muted line-through" : ""}`}>
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </li>
  );
}
