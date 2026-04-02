/** @type {import('next').NextConfig} */
function stripTrailingSlash(url) {
  return url.replace(/\/$/, "");
}

const MF = "[microfrontends]";

function debugMicrofrontendsEnabled() {
  const v = String(process.env.DEBUG_MICROFRONTENDS || "").toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function logMicrofrontends(message, detail) {
  if (detail !== undefined) {
    console.log(MF, message, detail);
  } else {
    console.log(MF, message);
  }
}

const nextConfig = {
  /**
   * Single-domain setup on Vercel: point these env vars (on the **web** project)
   * to each app’s production URL (origin only, e.g. https://my-docs.vercel.app).
   *
   * Logs: always one summary line when rewrites are computed (build / dev start).
   * Verbose: set DEBUG_MICROFRONTENDS=1 (also enables request logging in middleware).
   */
  async rewrites() {
    const debug = debugMicrofrontendsEnabled();
    const docsOrigin = process.env.DOCS_MICROFRONTEND_URL;
    const astroFromEnv = process.env.ASTRO_MICROFRONTEND_URL;
    const astroOrigin =
      astroFromEnv ||
      (process.env.NODE_ENV !== "production"
        ? "http://127.0.0.1:4321"
        : undefined);
    const rules = [];

    logMicrofrontends("rewrite setup", {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL ?? "(not set)",
      ASTRO_MICROFRONTEND_URL_from_env: astroFromEnv
        ? "(set)"
        : "(not set)",
      astroOrigin_used: astroOrigin ?? "(none — Astro rewrites off)",
      astro_source: astroFromEnv
        ? "env"
        : process.env.NODE_ENV !== "production"
          ? "dev-fallback-127.0.0.1:4321"
          : "none",
      DOCS_MICROFRONTEND_URL: docsOrigin ? "(set)" : "(not set)",
    });

    if (docsOrigin) {
      rules.push({
        source: "/docs/:path*",
        destination: `${stripTrailingSlash(docsOrigin)}/docs/:path*`,
      });
    }
    if (
      process.env.VERCEL &&
      process.env.NODE_ENV === "production" &&
      !process.env.ASTRO_MICROFRONTEND_URL
    ) {
      console.warn(
        `${MF} ASTRO_MICROFRONTEND_URL is unset on Vercel — /blogs and /_astro rewrites are disabled. Set it on the **web** project (Production), redeploy.`,
      );
    }

    if (astroOrigin) {
      const astroBase = stripTrailingSlash(astroOrigin);
      rules.push(
        {
          source: "/blogs",
          destination: `${astroBase}/blogs`,
        },
        {
          source: "/blogs/:path*",
          destination: `${astroBase}/blogs/:path*`,
        },
        {
          source: "/_astro/:path*",
          destination: `${astroBase}/_astro/:path*`,
        },
      );
    }

    logMicrofrontends(`registered ${rules.length} rewrite rule(s)`);
    if (debug && rules.length) {
      logMicrofrontends("rules detail", rules);
    }

    return rules;
  },
};

export default nextConfig;
