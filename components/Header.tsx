import Link from "next/link";
import { shop } from "@/config/shop";
import { telegramUrl } from "@/lib/format";
import { TelegramIcon } from "./Icons";
import MobileMenu from "./MobileMenu";

export const NAV_LINKS = [
  { href: "/products", label: "Shop all" },
  { href: "/products?category=shoes", label: "Shoes" },
  { href: "/products?category=clothes", label: "Clothes" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight transition-opacity hover:opacity-70"
          aria-label={`${shop.name} home`}
        >
          {shop.name}
          <span className="text-ember">.</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[0.95rem] font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline py-1">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={telegramUrl(`Hello ${shop.name}!`)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-tg active:scale-95 md:inline-flex"
          >
            <TelegramIcon width={18} height={18} /> Chat with us
          </a>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
