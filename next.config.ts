import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos live on Cloudinary. We never use Vercel image
    // optimisation: components/ProductImage.tsx uses a custom Cloudinary
    // loader (f_auto,q_auto,w_…) and marks every other image `unoptimized`.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
