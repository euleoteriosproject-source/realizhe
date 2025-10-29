"use strict";

const remoteHosts = new Set();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

try {
  if (supabaseUrl) {
    remoteHosts.add(new URL(supabaseUrl).hostname);
  }
} catch {
  console.warn("Invalid NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
}

try {
  if (storageUrl) {
    remoteHosts.add(new URL(storageUrl).hostname);
  }
} catch {
  console.warn("Invalid NEXT_PUBLIC_SUPABASE_STORAGE_URL:", storageUrl);
}

// fallback padrão caso variáveis não estejam definidas em build time
if (remoteHosts.size === 0) {
  remoteHosts.add("bpzzlunlzilhzdslfrvf.supabase.co");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: Array.from(remoteHosts).map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
