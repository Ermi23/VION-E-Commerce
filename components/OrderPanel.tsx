"use client";

import { useState } from "react";
import { shop } from "@/config/shop";
import { formatPrice, orderMessage, telUrl, telegramUrl } from "@/lib/format";
import { PhoneIcon, TelegramIcon } from "./Icons";

interface Props {
  product: {
    id: string;
    name: string;
    price: number | null;
    sizes: string[];
    colors: string[];
  };
  soldOut: boolean;
  /** Absolute link to this product, added to the Telegram message. */
  link: string;
}

function Choices({
  label,
  options,
  selected,
  onSelect,
  disabled,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  disabled: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-semibold">
        {label}
        {selected && <span className="ml-2 font-normal text-muted">{selected}</span>}
      </p>
      <ul className="mt-2.5 flex flex-wrap gap-2">
        {options.map((option) => {
          const isOn = option === selected;
          return (
            <li key={option}>
              <button
                type="button"
                disabled={disabled}
                aria-pressed={isOn}
                onClick={() => onSelect(isOn ? "" : option)}
                className={`min-h-11 min-w-11 rounded-full border px-4 text-sm font-medium transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${
                  isOn
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-card hover:border-ink disabled:hover:border-line"
                }`}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Size / colour chips plus the Order (Telegram) and Call buttons.
 * Picking a size or colour is optional; it is simply added to the message.
 */
export default function OrderPanel({ product, soldOut, link }: Props) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const orderHref = telegramUrl(orderMessage(product, { size, color, link }));
  const askHref = telegramUrl(
    `Hello ${shop.name}! Will "${product.name}" (code ${product.id}) be back in stock?\n\n${link}`,
  );

  return (
    <>
      <div className="space-y-6">
        <Choices label="Size" options={product.sizes} selected={size} onSelect={setSize} disabled={soldOut} />
        <Choices label="Colour" options={product.colors} selected={color} onSelect={setColor} disabled={soldOut} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {soldOut ? (
          <button type="button" disabled aria-disabled className="btn btn-disabled flex-1 text-base">
            Sold out
          </button>
        ) : (
          <a
            href={orderHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-tg flex-1 animate-ring text-base"
          >
            <TelegramIcon /> Order on Telegram
          </a>
        )}
        <a href={telUrl()} className="btn btn-light sm:px-7">
          <PhoneIcon /> Call {shop.phone}
        </a>
      </div>

      {soldOut ? (
        <p className="mt-4 text-sm text-muted">
          This item is sold out.{" "}
          <a href={askHref} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
            Ask if it is coming back
          </a>
          .
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">
          No online payment. Tap Order to send us a ready-made Telegram message — we will confirm
          availability and arrange pickup or delivery.
        </p>
      )}

      {/* Sticky order bar on phones */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 animate-rise border-t border-line bg-paper/95 px-4 pt-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted">{product.name}</p>
            <p className={`font-display text-lg font-semibold leading-tight ${soldOut ? "text-muted line-through" : ""}`}>
              {formatPrice(product.price)}
            </p>
          </div>
          <a
            href={telUrl()}
            aria-label={`Call ${shop.phone}`}
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-card transition active:scale-90"
          >
            <PhoneIcon />
          </a>
          {soldOut ? (
            <span className="btn btn-disabled shrink-0">Sold out</span>
          ) : (
            <a href={orderHref} target="_blank" rel="noopener noreferrer" className="btn btn-tg shrink-0">
              <TelegramIcon /> Order
            </a>
          )}
        </div>
      </div>
    </>
  );
}
