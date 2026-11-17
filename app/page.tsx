import Link from "next/link";
import CatalogueNotice from "@/components/CatalogueNotice";
import { ArrowRightIcon, ClockIcon, PinIcon, TelegramIcon } from "@/components/Icons";
import ProductGrid from "@/components/ProductGrid";
import ProductImage from "@/components/ProductImage";
import { shop } from "@/config/shop";
import { telegramUrl } from "@/lib/format";
import { availableFirst, getCatalogue } from "@/lib/products";
import type { Category, Product } from "@/lib/types";

const MARQUEE = ["New arrivals", "Shoes", "Clothes", "Men · Women · Kids", "Order on Telegram", "No online payment needed"];

function CategoryTile({
  category,
  title,
  blurb,
  products,
}: {
  category: Category;
  title: string;
  blurb: string;
  products: Product[];
}) {
  const inCategory = products.filter((p) => p.category === category);
  const cover = availableFirst(inCategory).find((p) => p.images.length > 0)?.images[0];
  return (
    <Link
      href={`/products?category=${category}`}
      className="reveal group relative flex aspect-[4/3] items-end overflow-hidden rounded-3xl bg-ink sm:aspect-[5/4]"
    >
      {cover && (
        <ProductImage
          src={cover}
          alt=""
          sizes="(min-width: 640px) 50vw, 100vw"
          className="opacity-80 transition duration-700 ease-out-soft group-hover:scale-105 group-hover:opacity-70"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
      <div className="relative flex w-full items-end justify-between gap-4 p-6 text-paper sm:p-8">
        <div>
          <p className="text-sm text-paper/75">
            {inCategory.length} {inCategory.length === 1 ? "item" : "items"} · {blurb}
          </p>
          <h3 className="mt-1 text-4xl font-bold sm:text-5xl">{title}</h3>
        </div>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition duration-300 ease-out-soft group-hover:translate-x-1 group-hover:bg-ember group-hover:text-white">
          <ArrowRightIcon />
        </span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const { products, ok } = await getCatalogue();

  const featured = availableFirst(products.filter((p) => p.featured)).slice(0, 8);
  // No featured rows in the Sheet? Fall back to the first products.
  const showcase = featured.length > 0 ? featured : availableFirst(products).slice(0, 8);
  const showcaseTitle = featured.length > 0 ? "Featured picks" : "Latest in store";

  return (
    <>
      {/* Hero */}
      <section className="container-page pt-6 sm:pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="py-4 lg:py-10">
            <p className="stagger inline-flex items-center gap-2 rounded-full bg-ember-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-ember">
              <span className="size-1.5 rounded-full bg-ember" /> {shop.tagline}
            </p>
            <h1
              className="stagger mt-5 text-[2.75rem] font-bold leading-[1.02] sm:text-6xl lg:text-7xl"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              Step out in <span className="text-ember">style</span>, every day.
            </h1>
            <p
              className="stagger mt-5 max-w-lg text-base text-muted sm:text-lg"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {shop.intro}
            </p>
            <div className="stagger mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--i": 3 } as React.CSSProperties}>
              <Link href="/products?category=shoes" className="btn btn-dark group">
                Shop shoes
                <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/products?category=clothes" className="btn btn-light group">
                Shop clothes
                <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative animate-fade">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-ink sm:aspect-[16/10] lg:aspect-[4/5]">
              {shop.heroImage ? (
                <ProductImage
                  src={shop.heroImage}
                  alt={`Inside ${shop.name}`}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  eager
                  className="animate-kenburns"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-ember to-ink" />
              )}
            </div>
            <a
              href={telegramUrl(`Hello ${shop.name}!`)}
              target="_blank"
              rel="noopener noreferrer"
              className="stagger absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-card p-3 pr-5 shadow-xl shadow-ink/10 transition hover:-translate-y-0.5 sm:left-6"
              style={{ "--i": 5 } as React.CSSProperties}
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-tg text-white animate-ring">
                <TelegramIcon width={22} height={22} />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold">Order on Telegram</span>
                <span className="text-muted">We reply fast</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="mt-14 overflow-hidden border-y border-line bg-card py-3.5" aria-hidden>
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {MARQUEE.map((item) => (
                <li key={item} className="flex items-center font-display text-sm font-semibold uppercase tracking-widest">
                  <span className="px-6">{item}</span>
                  <span className="text-ember">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {!ok ? (
        <CatalogueNotice />
      ) : (
        <>
          {/* Categories */}
          <section className="container-page mt-14 sm:mt-20" aria-labelledby="categories-title">
            <h2 id="categories-title" className="reveal text-2xl font-bold sm:text-3xl">
              Shop by category
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6">
              <CategoryTile category="shoes" title="Shoes" blurb="sneakers, trainers & more" products={products} />
              <CategoryTile category="clothes" title="Clothes" blurb="tops, dresses, jackets" products={products} />
            </div>
          </section>

          {/* Featured */}
          {showcase.length > 0 && (
            <section className="container-page mt-16 sm:mt-24" aria-labelledby="featured-title">
              <div className="reveal flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ember">Hand-picked</p>
                  <h2 id="featured-title" className="mt-1 text-2xl font-bold sm:text-3xl">
                    {showcaseTitle}
                  </h2>
                </div>
                <Link href="/products" className="link-underline hidden shrink-0 text-sm font-semibold sm:inline">
                  View all products →
                </Link>
              </div>
              <div className="mt-6">
                <ProductGrid products={showcase} />
              </div>
              <div className="mt-8 sm:hidden">
                <Link href="/products" className="btn btn-light w-full">
                  View all products <ArrowRightIcon />
                </Link>
              </div>
            </section>
          )}
        </>
      )}

      {/* How it works */}
      <section className="container-page mt-16 sm:mt-24" aria-labelledby="how-title">
        <h2 id="how-title" className="reveal text-2xl font-bold sm:text-3xl">
          Ordering is simple
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {[
            { title: "Browse", text: "Find the shoes or clothes you like and check sizes and colours." },
            { title: "Tap Order", text: "Telegram opens with a ready-made message. Just press send." },
            { title: "Pick up or get it delivered", text: "We confirm stock and agree how you get your order." },
          ].map((step, i) => (
            <li key={step.title} className="reveal rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5">
              <span className="flex size-10 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-paper">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Visit band */}
      <section className="container-page mt-16 sm:mt-24">
        <div className="reveal grid gap-8 overflow-hidden rounded-[2rem] bg-ember-soft p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-14">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Prefer to try it on? Come visit.</h2>
            <p className="mt-3 max-w-md text-muted">
              See everything in person, get help with sizes and take it home the same day.
            </p>
            <Link href="/contact" className="btn btn-dark mt-6">
              Contact & location <ArrowRightIcon />
            </Link>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-ember">
                <PinIcon />
              </span>
              <span>
                <span className="block font-semibold">Find us</span>
                <span className="text-muted">{shop.address.join(", ")}</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-ember">
                <ClockIcon />
              </span>
              <span>
                <span className="block font-semibold">Opening hours</span>
                {shop.hours.map((h) => (
                  <span key={h.days} className="block text-muted">
                    {h.days}: {h.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
