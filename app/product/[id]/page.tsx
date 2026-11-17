import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CatalogueNotice from "@/components/CatalogueNotice";
import Gallery from "@/components/Gallery";
import { CheckIcon } from "@/components/Icons";
import OrderPanel from "@/components/OrderPanel";
import ProductGrid from "@/components/ProductGrid";
import { shop } from "@/config/shop";
import { CATEGORY_LABEL, GENDER_LABEL, formatPrice, productPath, siteUrl, stockLabel } from "@/lib/format";
import { ogImage } from "@/lib/images";
import { availableFirst, findProduct, getCatalogue } from "@/lib/products";

type Params = Promise<{ id: string }>;

/** Next.js gives the id still URL-encoded in some cases; decode it safely. */
function decodeId(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function shortDescription(text: string, fallback: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return fallback;
  return flat.length > 155 ? `${flat.slice(0, 152).trimEnd()}…` : flat;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const { products, ok } = await getCatalogue();
  if (!ok) return { title: "Catalogue is being updated" };

  const product = findProduct(products, decodeId(id));
  if (!product) return { title: "Product not found" };

  const price = formatPrice(product.price);
  const description = shortDescription(
    product.description,
    `${product.name} — ${price} at ${shop.name}. Order on Telegram.`,
  );
  const image = ogImage(product.images[0]);

  return {
    title: `${product.name} — ${price}`,
    description,
    alternates: { canonical: productPath(product.id) },
    openGraph: {
      type: "website",
      title: `${product.name} — ${price}`,
      description,
      url: productPath(product.id),
      images: image ? [{ url: image, width: 1200, height: 630, alt: product.name }] : undefined,
    },
    twitter: { card: "summary_large_image", images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const { products, ok } = await getCatalogue();

  // Sheet unreachable: say so kindly instead of pretending the product is gone.
  if (!ok) return <CatalogueNotice />;

  const product = findProduct(products, decodeId(id));
  // Unknown ids and "hidden" rows (which never reach `products`) are a 404.
  if (!product) notFound();

  const soldOut = product.status === "sold_out";
  const stock = stockLabel(product);
  const lowStock = !soldOut && stock !== "In stock";
  const link = `${siteUrl()}${productPath(product.id)}`;

  const related = availableFirst(
    products.filter((p) => p.id !== product.id && p.category === product.category),
  ).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.id,
    description: product.description || undefined,
    image: product.images.length > 0 ? product.images : undefined,
    offers:
      product.price !== null
        ? {
            "@type": "Offer",
            price: product.price,
            priceCurrency: shop.currency,
            availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            url: link,
          }
        : undefined,
  };

  return (
    <div className="container-page pb-28 pt-6 sm:pt-10 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="animate-fade text-sm text-muted">
        <Link href="/" className="link-underline">
          Home
        </Link>{" "}
        /{" "}
        {product.category ? (
          <Link href={`/products?category=${product.category}`} className="link-underline">
            {CATEGORY_LABEL[product.category]}
          </Link>
        ) : (
          <Link href="/products" className="link-underline">
            Products
          </Link>
        )}{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-5 grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
        <div className="md:sticky md:top-24 md:self-start">
          <Gallery images={product.images} name={product.name} soldOut={soldOut} />
        </div>

        <div className="animate-rise md:py-4">
          <p className="text-sm text-muted">
            {[
              product.category ? CATEGORY_LABEL[product.category] : null,
              product.gender ? GENDER_LABEL[product.gender] : null,
              `Code ${product.id}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className={`font-display text-3xl font-semibold ${soldOut ? "text-muted line-through" : ""}`}>
              {formatPrice(product.price)}
            </p>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                soldOut
                  ? "bg-ink text-paper"
                  : lowStock
                    ? "bg-ember-soft text-ember"
                    : "bg-emerald-600/10 text-emerald-800"
              }`}
            >
              {!soldOut && !lowStock && <CheckIcon width={14} height={14} strokeWidth={3} />}
              {stock}
            </span>
          </div>

          <hr className="my-7 border-line" />

          <OrderPanel
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              sizes: product.sizes,
              colors: product.colors,
            }}
            soldOut={soldOut}
            link={link}
          />

          {product.description && (
            <section className="mt-9 border-t border-line pt-7" aria-labelledby="description-title">
              <h2 id="description-title" className="text-lg font-semibold">
                Description
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">{product.description}</p>
            </section>
          )}

          <section className="mt-7 rounded-2xl bg-sand p-5 text-sm" aria-label="Shop information">
            <p className="font-semibold">Pick up at {shop.name}</p>
            <p className="mt-1 text-muted">{shop.address.join(", ")}</p>
            <p className="mt-1 text-muted">{shop.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}</p>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-24" aria-labelledby="related-title">
          <h2 id="related-title" className="reveal text-2xl font-bold sm:text-3xl">
            You may also like
          </h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
