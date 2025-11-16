// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: new URL('.', import.meta.url).pathname, // mvp folder
};

export default nextConfig;
