/** @type {import('next').NextConfig} */
function stripTrailingSlash(url) {
  return url.replace(/\/$/, "");
}

const nextConfig = {
  /**
   * Single-domain setup on Vercel: point these env vars (on the **web** project)
   * to each app’s production URL (origin only, e.g. https://my-docs.vercel.app).
   * Deploy docs + astro first, copy their *.vercel.app URLs, then set env on web.
   */
  async rewrites() {
    const docsOrigin = process.env.DOCS_MICROFRONTEND_URL;
    const astroOrigin = process.env.ASTRO_MICROFRONTEND_URL;
    const rules = [];

    if (docsOrigin) {
      rules.push({
        source: "/docs/:path*",
        destination: `${stripTrailingSlash(docsOrigin)}/docs/:path*`,
      });
    }
    if (astroOrigin) {
      const astroBase = stripTrailingSlash(astroOrigin);
      // Astro is deployed at / on its own host (e.g. /blogs, not /astro/blogs).
      rules.push({
        source: "/blogs",
        destination: `${astroBase}/blogs`,
      });
      rules.push({
        source: "/blogs/:path*",
        destination: `${astroBase}/blogs/:path*`,
      });
      // Built assets stay under /_astro on the Astro host; browser requests them on the web domain too.
      rules.push({
        source: "/_astro/:path*",
        destination: `${astroBase}/_astro/:path*`,
      });
    }
    return rules;
  },
};

export default nextConfig;
