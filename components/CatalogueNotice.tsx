import { shop } from "@/config/shop";
import { telUrl, telegramUrl } from "@/lib/format";
import { PhoneIcon, TelegramIcon } from "./Icons";

/** Friendly message shown whenever the Google Sheet cannot be read. */
export default function CatalogueNotice() {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="mx-auto max-w-md animate-rise rounded-3xl border border-line bg-card p-8 text-center sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-ember-soft text-2xl" aria-hidden>
          🧺
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Our catalogue is being updated</h1>
        <p className="mt-3 text-muted">
          We are adding new items right now. Please check back in a few minutes — or message us and
          we will tell you what is in stock.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={telegramUrl(`Hello ${shop.name}! What do you have in stock?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-tg"
          >
            <TelegramIcon /> Message us
          </a>
          <a href={telUrl()} className="btn btn-light">
            <PhoneIcon /> Call
          </a>
        </div>
      </div>
    </section>
  );
}
