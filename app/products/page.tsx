import type { Metadata } from "next";
import Link from "next/link";
import CatalogueNotice from "@/components/CatalogueNotice";
import Filters, { type FilterValues } from "@/components/Filters";
import Pagination from "@/components/Pagination";
import ProductGrid from "@/components/ProductGrid";
import { shop } from "@/config/shop";
import { availableFirst, collectSizes, getCatalogue } from "@/lib/products";
import type { Product } from "@/lib/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Products per page. 12 keeps pages light on slow phone connections. */
const PAGE_SIZE = 12;

const CATEGORY_TABS = [
  { value: "", label: "All" },
  { value: "shoes", label: "Shoes" },
  { value: "clothes", label: "Clothes" },
];

const first = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

/** Reads the filters from the address, ignoring anything unexpected. */
async function readFilters(searchParams: SearchParams): Promise<FilterValues> {
  const params = await searchParams;
  const category = first(params.category).toLowerCase();
  const gender = first(params.gender).toLowerCase();
  const sort = first(params.sort).toLowerCase();
  return {
    category: ["shoes", "clothes"].includes(category) ? category : "",
    gender: ["men", "women", "unisex", "kids"].includes(gender) ? gender : "",
    size: first(params.size).slice(0, 20),
    q: first(params.q).slice(0, 80),
    sort: ["price-asc", "price-desc"].includes(sort) ? sort : "",
  };
}

function pageTitle(category: string): string {
  if (category === "shoes") return "Shoes";
  if (category === "clothes") return "Clothes";
  return "All products";
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category } = await readFilters(searchParams);
  const title = pageTitle(category);
  const what = category || "shoes and clothes";
  return {
    title,
    description: `Browse ${what} at ${shop.name}. See prices and sizes, then order on Telegram.`,
    alternates: { canonical: category ? `/products?category=${category}` : "/products" },
  };
}

function applyFilters(products: Product[], f: FilterValues): Product[] {
  const words = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const size = f.size.toLowerCase();

  let list = products.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    // Unisex items suit both men and women, so include them in those filters.
    if (f.gender) {
      const matches =
        p.gender === f.gender || (p.gender === "unisex" && (f.gender === "men" || f.gender === "women"));
      if (!matches) return false;
    }
    if (size && !p.sizes.some((s) => s.toLowerCase() === size)) return false;
    if (words.length > 0) {
      const name = p.name.toLowerCase();
      if (!words.every((word) => name.includes(word))) return false;
    }
    return true;
  });

  if (f.sort) {
    const direction = f.sort === "price-asc" ? 1 : -1;
    // Products without a price always go last.
    list = [...list].sort((a, b) => {
      if (a.price === null) return b.price === null ? 0 : 1;
      if (b.price === null) return -1;
      return (a.price - b.price) * direction;
    });
  }

  // Available first, sold out after — whatever the sort order.
  return availableFirst(list);
}

/** Address of a given results page, keeping every current filter. */
function pageHref(page: number, f: FilterValues): string {
  const params = new URLSearchParams();
  for (const key of ["category", "gender", "size", "q", "sort"] as const) {
    if (f[key]) params.set(key, f[key]);
  }
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

function tabHref(category: string, f: FilterValues): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (f.gender) params.set("gender", f.gender);
  if (f.q) params.set("q", f.q);
  if (f.sort) params.set("sort", f.sort);
  // Size is dropped on purpose: shoe sizes and clothes sizes differ.
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const [filters, { products, ok }] = await Promise.all([readFilters(searchParams), getCatalogue()]);

  if (!ok) return <CatalogueNotice />;

  const inCategory = filters.category ? products.filter((p) => p.category === filters.category) : products;
  const sizes = collectSizes(inCategory);
  const results = applyFilters(products, filters);

  // Pagination: a page number that is missing, junk or too high is clamped.
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const requested = Number.parseInt(first((await searchParams).page), 10);
  const page = Math.min(totalPages, Math.max(1, Number.isFinite(requested) ? requested : 1));
  const start = (page - 1) * PAGE_SIZE;
  const visible = results.slice(start, start + PAGE_SIZE);
  const activeFilters = [filters.gender, filters.size, filters.q].filter(Boolean).length;
  const clearHref = filters.category ? `/products?category=${filters.category}` : "/products";

  return (
    <div className="container-page pt-8 sm:pt-12">
      <header className="animate-rise">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/" className="link-underline">
            Home
          </Link>{" "}
          / <span className="text-ink">{pageTitle(filters.category)}</span>
        </nav>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{pageTitle(filters.category)}</h1>
      </header>

      {/* Category tabs */}
      <div className="no-scrollbar -mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-2" aria-label="Category">
          {CATEGORY_TABS.map((tab) => {
            const active = tab.value === filters.category;
            return (
              <li key={tab.label}>
                <Link
                  href={tabHref(tab.value, filters)}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition duration-200 active:scale-95 ${
                    active ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <Filters values={filters} sizes={sizes} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-muted" aria-live="polite">
        <p>
          {totalPages > 1
            ? `Showing ${start + 1}–${start + visible.length} of ${results.length} products`
            : `${results.length} ${results.length === 1 ? "product" : "products"}`}
          {filters.q && (
            <>
              {" "}
              for “<span className="text-ink">{filters.q}</span>”
            </>
          )}
        </p>
        {activeFilters > 0 && (
          <Link href={clearHref} scroll={false} className="font-semibold text-ink underline underline-offset-4">
            Clear filters
          </Link>
        )}
      </div>

      <div className="mt-5">
        {results.length > 0 ? (
          // The key restarts the entrance animation when the filters change.
          <>
            <ProductGrid key={JSON.stringify([filters, page])} products={visible} />
            <Pagination page={page} totalPages={totalPages} hrefFor={(p) => pageHref(p, filters)} />
          </>
        ) : (
          <div className="animate-rise rounded-3xl border border-dashed border-line bg-card px-6 py-16 text-center">
            <p className="text-4xl" aria-hidden>
              🔍
            </p>
            <h2 className="mt-4 text-xl font-semibold">Nothing matches yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-muted">
              Try a different size or search word — or clear the filters to see everything.
            </p>
            <Link href={clearHref} scroll={false} className="btn btn-dark mt-6">
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
