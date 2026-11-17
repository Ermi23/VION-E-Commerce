import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="container-page py-20 text-center sm:py-28">
      <p className="animate-rise font-display text-8xl font-bold text-ember sm:text-9xl">404</p>
      <h1 className="stagger mt-4 text-2xl font-semibold sm:text-3xl" style={{ "--i": 1 } as React.CSSProperties}>
        We could not find that page
      </h1>
      <p className="stagger mx-auto mt-3 max-w-sm text-muted" style={{ "--i": 2 } as React.CSSProperties}>
        The product may no longer be available. Have a look at what is in the shop right now.
      </p>
      <div className="stagger mt-8 flex flex-col justify-center gap-3 sm:flex-row" style={{ "--i": 3 } as React.CSSProperties}>
        <Link href="/products" className="btn btn-dark">
          Browse products <ArrowRightIcon />
        </Link>
        <Link href="/" className="btn btn-light">
          Go home
        </Link>
      </div>
    </section>
  );
}
