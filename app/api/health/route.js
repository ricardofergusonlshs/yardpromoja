export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    app: "YardPromoJa",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}