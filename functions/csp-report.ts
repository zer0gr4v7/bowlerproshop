export async function onRequest(context: any) {
  const request = context.request as Request;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }

  const body = await request.text().catch(() => "");
  context.waitUntil?.(
    Promise.resolve(
      console.log(
        JSON.stringify({
          event: "csp_report",
          bytes: body.length,
          sample: body.slice(0, 2000),
        }),
      ),
    ),
  );

  return new Response(null, { status: 204 });
}
