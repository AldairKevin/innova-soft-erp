export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const target = searchParams.get("url");

    if (!target) {
      return Response.json({ error: "Missing url" }, { status: 400 });
    }

    const res = await fetch(target, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Proxy failed", details: String(error) },
      { status: 500 }
    );
  }
}