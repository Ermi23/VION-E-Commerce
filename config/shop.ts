/**
 * Everything about the shop that is not a product lives here.
 * Change these values and redeploy — nothing else needs editing.
 */
export const shop = {
  /** Shop name, shown in the header, page titles and Telegram messages. */
  name: "VION",

  /** One short line under the name. */
  tagline: "Shoes & clothes, picked with care",

  /** Short intro paragraph on the home page (also used for search engines). */
  intro:
    "Fresh sneakers and everyday clothes for men, women and kids. Browse the catalogue, pick what you like and order in one tap on Telegram.",

  /** Currency label shown before every price. */
  currency: "ETB",

  /**
   * Telegram contact for orders. Set NEXT_PUBLIC_TELEGRAM in the environment
   * (.env.local locally, Environment Variables on Vercel). It can be either
   * a phone number WITH country code (e.g. 251911223344) or a Telegram
   * username (e.g. vionshop). The value after || is only a placeholder.
   */
  telegram: process.env.NEXT_PUBLIC_TELEGRAM?.trim() || "+251 940 668 987",

  /**
   * Phone number as customers should see it, used for the Call button.
   * Set NEXT_PUBLIC_PHONE in the environment. The value after || is a placeholder.
   */
  phone: process.env.NEXT_PUBLIC_PHONE?.trim() || "+251 940 668 987",

  /** Address lines. TODO: replace. */
  address: ["Megenagnan Near to Zefmesh Mall", "Addis Ababa, Ethiopia"],

  /** Optional Google Maps link for the "Get directions" button ("" hides it). */
  mapUrl: "",

  /** Opening hours. TODO: replace. */
  hours: [
    { days: "Monday – Saturday", time: "9:00 AM – 8:00 PM" },
    { days: "Sunday", time: "10:00 AM – 6:00 PM" },
  ],

  /**
   * Big photo on the home page. Use a Cloudinary URL of your own shop photo.
   * Leave "" to show a plain coloured panel instead.
   * TODO: this is a Cloudinary demo photo — replace it with your own.
   */
  heroImage: "https://res.cloudinary.com/demo/image/upload/docs/models.jpg",
} as const;

export type Shop = typeof shop;
