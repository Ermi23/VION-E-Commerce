"use client";

import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import ProductImage from "./ProductImage";

interface Props {
  images: string[];
  name: string;
  soldOut: boolean;
}

/**
 * Swipeable gallery: native scroll-snap does the work (smooth on cheap
 * phones), JavaScript only keeps the dots / thumbnails in sync.
 */
export default function Gallery({ images, name, soldOut }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const slides = images.length > 0 ? images : [undefined];
  const many = slides.length > 1;

  function goTo(index: number) {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(slides.length - 1, index));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }

  function onScroll() {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== active) setActive(index);
  }

  const dim = soldOut ? "opacity-50 grayscale" : "";

  return (
    <div className="animate-fade">
      <div className="relative overflow-hidden rounded-3xl bg-sand">
        <div
          ref={track}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          aria-roledescription="carousel"
          aria-label={`${name} photos`}
        >
          {slides.map((src, i) => (
            <div
              key={src ?? "placeholder"}
              className="relative aspect-[4/5] w-full shrink-0 snap-center"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              <ProductImage
                src={src}
                alt={many ? `${name} — photo ${i + 1}` : name}
                sizes="(min-width: 1024px) 50vw, 100vw"
                eager={i === 0}
                className={dim}
              />
            </div>
          ))}
        </div>

        {soldOut && (
          <span className="absolute left-4 top-4 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-paper">
            Sold out
          </span>
        )}

        {many && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 shadow transition hover:bg-card active:scale-90 disabled:opacity-0 md:flex"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === slides.length - 1}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 shadow transition hover:bg-card active:scale-90 disabled:opacity-0 md:flex"
            >
              <ChevronRightIcon />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full bg-ink transition-all duration-300 ${
                    i === active ? "w-5 opacity-90" : "w-1.5 opacity-30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {many && (
        <ul className="mt-3 hidden gap-3 md:flex">
          {slides.map((src, i) => (
            <li key={src ?? i}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active}
                className={`relative block size-20 overflow-hidden rounded-xl bg-sand ring-2 ring-offset-2 ring-offset-paper transition ${
                  i === active ? "ring-ink" : "ring-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <ProductImage src={src} alt="" sizes="80px" className={dim} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
