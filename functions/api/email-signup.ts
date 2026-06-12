export async function onRequest(context: any) {
  const request = context.request as Request;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }

  const payload = await request.json().catch(() => ({}));
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const gearNeed = typeof payload.gearNeed === "string" ? payload.gearNeed : "checklist";
  const bowlerType = typeof payload.bowlerType === "string" ? payload.bowlerType : "unknown";

  if (!email || !email.includes("@")) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  context.waitUntil?.(
    Promise.resolve(
      console.log(
        JSON.stringify({
          event: "email_signup",
          gear_need: gearNeed,
          bowler_type: bowlerType,
          has_email: true,
        }),
      ),
    ),
  );

  return Response.json({ success: true, message: "Welcome to the pro shop." });
}
