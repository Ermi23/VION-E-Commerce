import Link from "next/link";
import { shop } from "@/config/shop";
import { telUrl, telegramUrl } from "@/lib/format";
import { NAV_LINKS } from "./Header";
import { PhoneIcon, TelegramIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="lg:col-span-1">
          <p className="font-display text-3xl font-bold">
            {shop.name}
            <span className="text-ember">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-paper/65">{shop.tagline}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-paper/50">Shop</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline text-paper/85 hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-paper/50">Visit us</h2>
          <address className="mt-4 space-y-1 text-sm not-italic text-paper/85">
            {shop.address.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
          <dl className="mt-4 space-y-1 text-sm text-paper/65">
            {shop.hours.map((h) => (
              <div key={h.days} className="flex flex-wrap gap-x-2">
                <dt>{h.days}:</dt>
                <dd className="text-paper/85">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-paper/50">Order</h2>
          <div className="mt-4 flex flex-col items-start gap-3">
            <a
              href={telegramUrl(`Hello ${shop.name}!`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-tg"
            >
              <TelegramIcon /> Telegram
            </a>
            <a href={telUrl()} className="inline-flex items-center gap-2 text-sm text-paper/85 hover:text-paper">
              <PhoneIcon width={16} height={16} /> {shop.phone}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="container-page py-5 text-xs text-paper/50">
          © {new Date().getFullYear()} {shop.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
