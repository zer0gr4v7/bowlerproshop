const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy-Report-Only": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.clarity.ms https://*.clarity.ms",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "report-uri /csp-report",
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
};

function robotsHeaderForPath(pathname: string) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  if (["/disclosure", "/privacy"].includes(cleanPath)) return "noindex, follow";
  if (cleanPath.startsWith("/go/") || cleanPath.startsWith("/api/") || cleanPath === "/csp-report") {
    return "noindex, nofollow";
  }
  return "";
}

function withSecurityHeaders(response: Response, pathname = "") {
  const secured = new Response(response.body, response);
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    secured.headers.set(header, value);
  });
  const robotsHeader = robotsHeaderForPath(pathname);
  if (robotsHeader) {
    secured.headers.set("X-Robots-Tag", robotsHeader);
  }
  return secured;
}

export async function onRequest(context: any) {
  const request = context.request as Request;
  const url = new URL(request.url);
  const cleanPath = url.pathname.replace(/\/+$/, "") || "/";

  if (url.hostname === "www.bowlerproshop.com") {
    url.hostname = "bowlerproshop.com";
    return withSecurityHeaders(Response.redirect(url.toString(), 301), cleanPath);
  }

  const canonicalAliases: Record<string, string> = {
    "/affiliate-disclosure": "/disclosure",
    "/privacy-policy": "/privacy",
  };
  const canonicalPath = canonicalAliases[cleanPath];

  if (canonicalPath) {
    url.pathname = canonicalPath;
    return withSecurityHeaders(Response.redirect(url.toString(), 308), cleanPath);
  }

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = cleanPath;
    return withSecurityHeaders(Response.redirect(url.toString(), 308), cleanPath);
  }

  const response = await context.next();
  const acceptsHtml = request.headers.get("accept")?.includes("text/html");
  const isAssetRequest = /\.[a-z0-9]+$/i.test(url.pathname);

  if (
    response.status === 404 &&
    request.method === "GET" &&
    acceptsHtml &&
    !isAssetRequest &&
    !url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/go/")
  ) {
    return withSecurityHeaders(await context.env.ASSETS.fetch(new URL("/index.html", url)), cleanPath);
  }

  return withSecurityHeaders(response, cleanPath);
}
