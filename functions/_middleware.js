export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Don't redirect if already on /sl
  if (url.pathname.startsWith("/sl")) {
    return context.next();
  }

  // Skip API routes
  if (url.pathname.startsWith("/api")) {
    return context.next();
  }

  // Get visitor country
  const country = context.request.cf?.country;

  // Redirect Slovenian visitors
  if (country === "SI") {
    return Response.redirect(`${url.origin}/sl/`, 302);
  }

  return context.next();
}