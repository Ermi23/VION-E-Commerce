"use client";

import { useRouter } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { SearchIcon } from "./Icons";

export interface FilterValues {
  category: string;
  gender: string;
  size: string;
  q: string;
  sort: string;
}

interface Props {
  values: FilterValues;
  sizes: string[];
}

const GENDERS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
  { value: "kids", label: "Kids" },
];

/**
 * Search + gender + size + sort. It is a plain GET form, so it works even
 * before JavaScript loads; with JavaScript, dropdowns apply instantly and
 * empty values are kept out of the address.
 */
export default function Filters({ values, sizes }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function apply(form: HTMLFormElement) {
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form)) {
      const text = String(value).trim();
      if (text) params.set(key, text);
    }
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/products?${query}` : "/products", { scroll: false });
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    apply(event.currentTarget);
    // Hide the phone keyboard after searching.
    (document.activeElement as HTMLElement | null)?.blur?.();
  }

  return (
    <form
      action="/products"
      method="get"
      role="search"
      onSubmit={onSubmit}
      onChange={(event) => {
        if ((event.target as HTMLElement).tagName === "SELECT") apply(event.currentTarget);
      }}
      // Remount when the URL changes so the fields always match it.
      key={JSON.stringify(values)}
      aria-busy={pending}
      className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]"
    >
      {values.category && <input type="hidden" name="category" value={values.category} />}

      <div className="relative col-span-2 lg:col-span-1">
        <label htmlFor="q" className="sr-only">
          Search by name
        </label>
        <input
          id="q"
          name="q"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          defaultValue={values.q}
          placeholder="Search by name…"
          className="field pr-12"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:text-ink active:scale-90"
        >
          {pending ? (
            <span className="size-4 animate-spin rounded-full border-2 border-line border-t-ink" />
          ) : (
            <SearchIcon />
          )}
        </button>
      </div>

      <div>
        <label htmlFor="gender" className="sr-only">
          Gender
        </label>
        <select id="gender" name="gender" defaultValue={values.gender} className="field">
          <option value="">Everyone</option>
          {GENDERS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="size" className="sr-only">
          Size
        </label>
        <select id="size" name="size" defaultValue={values.size} className="field">
          <option value="">All sizes</option>
          {sizes.map((size) => (
            <option key={size} value={size}>
              Size {size}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-2 lg:col-span-1">
        <label htmlFor="sort" className="sr-only">
          Sort
        </label>
        <select id="sort" name="sort" defaultValue={values.sort} className="field">
          <option value="">Sort: Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
    </form>
  );
}
