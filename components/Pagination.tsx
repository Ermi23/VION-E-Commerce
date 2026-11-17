import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

interface Props {
  page: number;
  totalPages: number;
  /** Builds the address for a given page number, keeping the current filters. */
  hrefFor: (page: number) => string;
}

/** Page numbers to show: first, last, and the ones around the current page. */
function pageList(page: number, total: number): (number | "gap")[] {
  const wanted = new Set([1, total, page - 1, page, page + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

const cell =
  "inline-flex size-11 items-center justify-center rounded-full border text-sm font-semibold transition duration-200 active:scale-90";

export default function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} aria-label="Previous page" className={`${cell} border-line bg-card hover:border-ink`}>
          <ChevronLeftIcon />
        </Link>
      ) : (
        <span aria-hidden className={`${cell} border-line text-muted opacity-40`}>
          <ChevronLeftIcon />
        </span>
      )}

      {pageList(page, totalPages).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-muted">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`${cell} ${
              item === page ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"
            }`}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} aria-label="Next page" className={`${cell} border-line bg-card hover:border-ink`}>
          <ChevronRightIcon />
        </Link>
      ) : (
        <span aria-hidden className={`${cell} border-line text-muted opacity-40`}>
          <ChevronRightIcon />
        </span>
      )}
    </nav>
  );
}
