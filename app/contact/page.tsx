import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon, PhoneIcon, PinIcon, TelegramIcon } from "@/components/Icons";
import { shop } from "@/config/shop";
import { telUrl, telegramUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact & location",
  description: `Call or message ${shop.name} on Telegram, find our address and opening hours. ${shop.address.join(", ")}.`,
  alternates: { canonical: "/contact" },
};

const card =
  "stagger flex flex-col rounded-3xl border border-line bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5 sm:p-7";
const iconWrap = "flex size-12 items-center justify-center rounded-full bg-ember-soft text-ember";

export default function ContactPage() {
  const mapHref =
    shop.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name}, ${shop.address.join(", ")}`)}`;

  return (
    <div className="container-page pt-8 sm:pt-12">
      <header className="max-w-2xl animate-rise">
        <p className="text-xs font-semibold uppercase tracking-widest text-ember">Contact & about</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Come say hello</h1>
        <p className="mt-4 text-base text-muted sm:text-lg">
          {shop.name} is a shoe and clothing shop. {shop.intro}
        </p>
      </header>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <section className={card} aria-labelledby="order-title">
          <span className={iconWrap}>
            <PhoneIcon />
          </span>
          <h2 id="order-title" className="mt-5 text-xl font-semibold">
            Call or message
          </h2>
          <p className="mt-1.5 text-sm text-muted">The fastest way to order or ask about sizes.</p>
          <a href={telUrl()} className="mt-4 font-display text-2xl font-semibold hover:text-ember">
            {shop.phone}
          </a>
          <div className="mt-auto flex flex-col gap-3 pt-6">
            <a
              href={telegramUrl(`Hello ${shop.name}!`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-tg"
            >
              <TelegramIcon /> Chat on Telegram
            </a>
            <a href={telUrl()} className="btn btn-light">
              <PhoneIcon /> Call now
            </a>
          </div>
        </section>

        <section className={card} style={{ "--i": 1 } as React.CSSProperties} aria-labelledby="location-title">
          <span className={iconWrap}>
            <PinIcon />
          </span>
          <h2 id="location-title" className="mt-5 text-xl font-semibold">
            Location
          </h2>
          <address className="mt-1.5 not-italic text-muted">
            {shop.address.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
          <div className="mt-auto pt-6">
            <a href={mapHref} target="_blank" rel="noopener noreferrer" className="btn btn-light w-full">
              Get directions <ArrowRightIcon />
            </a>
          </div>
        </section>

        <section
          className={`${card} sm:col-span-2 lg:col-span-1`}
          style={{ "--i": 2 } as React.CSSProperties}
          aria-labelledby="hours-title"
        >
          <span className={iconWrap}>
            <ClockIcon />
          </span>
          <h2 id="hours-title" className="mt-5 text-xl font-semibold">
            Opening hours
          </h2>
          <dl className="mt-3 divide-y divide-line">
            {shop.hours.map((h) => (
              <div key={h.days} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                <dt className="text-muted">{h.days}</dt>
                <dd className="text-right font-semibold">{h.time}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="reveal mt-10 flex flex-col items-start justify-between gap-5 rounded-[2rem] bg-ink p-7 text-paper sm:flex-row sm:items-center sm:p-10">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Not sure what you want yet?</h2>
          <p className="mt-2 text-paper/65">Browse the full catalogue — new items are added all the time.</p>
        </div>
        <Link href="/products" className="btn shrink-0 bg-paper text-ink hover:bg-ember hover:text-white">
          Browse products <ArrowRightIcon />
        </Link>
      </section>
    </div>
  );
}
