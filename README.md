# VION — shoes & clothes catalogue

A fast, mobile-first catalogue website. Customers browse products and order
through Telegram or a phone call. There is no cart, no online payment, no
accounts and no database: **all products come from one Google Sheet** that the
shop owner edits. The Sheet is the admin panel.

- Next.js (App Router) + TypeScript + Tailwind CSS
- Runs on Vercel's free plan, with no paid services
- Sheet edits appear on the site within about a minute, without redeploying

---

## For the shop owner: managing products

You only ever need to edit the Google Sheet. Changes show up on the website
about **one minute** after you type them. Nothing you type can break the site —
a row with a mistake is simply skipped or shown with safe defaults.

### The columns

| Column | What to type | Example |
| --- | --- | --- |
| `id` | A unique code for the product. Never reuse or change it once the product is live (it is part of the product's web address). | `SH-001` |
| `name` | The product name. | `Retro Air Sneakers` |
| `category` | `shoes` or `clothes` | `shoes` |
| `gender` | `men`, `women`, `unisex` or `kids` | `unisex` |
| `price` | Numbers only, no currency. | `6500` |
| `sizes` | Sizes separated by commas. | `40, 41, 42` or `S, M, L` |
| `colors` | Colours separated by commas. | `White, Black` |
| `quantity` | How many you have. | `5` |
| `status` | `available`, `sold_out` or `hidden` (empty means available). | `available` |
| `image_urls` | One or more Cloudinary photo links, separated by commas. The first is the main photo. | `https://res.cloudinary.com/…/shoe.jpg` |
| `description` | A sentence or two about the product. | |
| `featured` | `yes` to show it on the home page, otherwise `no`. | `yes` |

Capital letters and extra spaces do not matter (`Sold Out`, `SOLD_OUT` and
`sold out` all work).

### Add a product

1. Go to the first empty row at the bottom of the Sheet.
2. Type a new `id` that no other row uses, and a `name`. These two are required — a row without them is ignored.
3. Fill in the other columns. Upload the photo to Cloudinary, copy its link and paste it into `image_urls`.
4. Wait a minute and refresh the website.

No photo yet? Leave `image_urls` empty; the site shows a "Photo coming soon" picture.

### Mark a product sold out

Change its `status` to `sold_out` (or set `quantity` to `0`).

The product **stays on the site** with a "Sold out" badge and a greyed-out
photo, and customers can no longer order it. When it is back in stock, change
`status` to `available` and update `quantity`.

### Hide a product

Change its `status` to `hidden`.

The product disappears from the site completely and its page stops working.
Use this for products you do not want anyone to see. To bring it back, change
`status` to `available`. (You can also delete the row, but hiding is safer —
you keep the information.)

### Tips

- **Format the whole Sheet as plain text** once (select all → Format → Number → Plain text). Otherwise Google can drop a cell such as a single size `42` in a column that mostly holds text like `40, 41`.
- Keep row 1 (the column names) exactly as it is.
- The tab at the bottom of the Sheet must be named `Products`.
- If the website shows "Our catalogue is being updated", the site cannot read the Sheet. Check that it is still shared as *Anyone with the link → Viewer*.

---

## For the developer

### Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then put your Sheet ID in .env.local
npm run dev
```

Open http://localhost:3000.

If `SHEET_ID` is empty, the site runs with built-in demo products
(`lib/sample-data.ts`), so you can try it before a Sheet exists.

### Set up the Google Sheet

1. Create a Google Sheet and rename its tab to **Products**.
2. Import `sample-sheet/products.csv` (File → Import → Upload → *Replace current sheet*) to get the right header row and some example rows.
3. Select all cells and choose Format → Number → **Plain text**.
4. Share → General access → **Anyone with the link → Viewer**.
5. Copy the ID from the address — `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit` — into `SHEET_ID`.

### Shop details

The two contact numbers are environment variables (set them in `.env.local`
locally and under Environment Variables on Vercel):

| Variable | What it is | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_TELEGRAM` | Telegram contact that receives orders: a phone number with country code (digits only) or a Telegram username | `251911223344` or `vionshop` |
| `NEXT_PUBLIC_PHONE` | Phone number shown on the site and dialled by the Call button | `+251 91 122 3344` |

If they are empty the site shows placeholder numbers. After changing them on
Vercel, redeploy — they are built into the pages.

When `NEXT_PUBLIC_TELEGRAM` is a phone number, that Telegram account must allow
being found by phone number (Telegram → Settings → Privacy and Security →
Phone Number → "Who can find me by my number": Everybody). A username always works.

Everything else is in `config/shop.ts`: shop name, currency, address, opening
hours and the home-page photo. The values marked `TODO` there are placeholders
and must be replaced before going live.

### Deploy to Vercel

1. Push this repository to GitHub.
2. On vercel.com choose **Add New → Project** and import the repository. The defaults are correct.
3. Under **Environment Variables** add `SHEET_ID`, `NEXT_PUBLIC_TELEGRAM` and `NEXT_PUBLIC_PHONE`.
4. Deploy.

Optional: when you add a custom domain, set `NEXT_PUBLIC_SITE_URL` (e.g.
`https://www.yourshop.com`) so links in Telegram messages and social previews
use it. Without it the Vercel production address is used.

Changing `config/shop.ts` needs a redeploy (push to GitHub). Changing products
never does.

### How it works

| Path | Purpose |
| --- | --- |
| `config/shop.ts` | All shop details and contact info |
| `lib/products.ts` | **The only file that talks to the Sheet.** Fetches the CSV server-side (cached 60 s), cleans every row and returns typed `Product` objects. Swap the data source here. |
| `lib/types.ts` | The `Product` type |
| `lib/format.ts` | Prices, Telegram/phone links, order message |
| `lib/images.ts` | Cloudinary loader (`f_auto,q_auto,w_…`) and Open Graph image URLs |
| `app/page.tsx` | Home |
| `app/products/page.tsx` | Listing with category, gender, size, search and price sort |
| `app/product/[id]/page.tsx` | Product detail, order buttons, SEO metadata |
| `app/contact/page.tsx` | Phone, location, opening hours |
| `components/` | UI pieces; only five small ones run JavaScript in the browser |

Behaviour worth knowing:

- **Bad data never crashes the site.** Rows without `id` or `name`, and rows that reuse an `id`, are skipped with a warning in the server log (Vercel → Logs). Unknown `status` counts as available; unknown `category`/`gender` are left blank; a non-numeric price shows "Ask for price".
- **Sold out** products stay visible and are always listed after available ones. `quantity` of `0` also counts as sold out.
- **Hidden** products are removed inside `lib/products.ts`, so they cannot appear anywhere and their URL returns 404.
- **Sheet unreachable** → pages show a friendly "catalogue is being updated" message.
- **Images** never use Vercel image optimisation. Cloudinary URLs get `f_auto,q_auto` and a width that fits the device; other URLs are used as they are; broken ones fall back to a placeholder. Images below the fold lazy-load.
- **Animations** are CSS only and are switched off for visitors who ask for reduced motion.

### Commands

```bash
npm run dev        # develop
npm run build      # production build
npm run start      # run the production build
npm run typecheck  # TypeScript check
```
