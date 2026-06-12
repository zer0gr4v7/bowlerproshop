import { MERCHANT_INVENTORY, Retailer, getAffiliateLink, isEnabledRetailer } from "../../../src/lib/affiliate";

export async function onRequest(context: any) {
  const request = context.request as Request;

  if (!["GET", "HEAD"].includes(request.method)) {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }

  const retailer = String(context.params.retailer || "").toLowerCase() as Retailer;
  const slug = String(context.params.slug || "");
  const url = new URL(request.url);
  const query = String(url.searchParams.get("q") || slug).replace(/-/g, " ").trim();
  const source = url.searchParams.get("source") || "direct";

  if (!isEnabledRetailer(retailer) || !query) {
    return Response.json(
      {
        error: "affiliate_destination_not_configured",
        message: "That merchant destination is not configured yet.",
      },
      { status: 404 },
    );
  }

  context.waitUntil?.(
    Promise.resolve(
      console.log(
        JSON.stringify({
          event: "affiliate_click",
          retailer,
          merchant_name: MERCHANT_INVENTORY[retailer]?.name,
          approval_status: MERCHANT_INVENTORY[retailer]?.approvalStatus,
          slug,
          query,
          source,
        }),
      ),
    ),
  );

  return Response.redirect(getAffiliateLink(retailer, query), 302);
}
