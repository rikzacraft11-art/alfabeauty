import { draftMode } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const store = await draftMode();
  store.disable();
  return Response.redirect(new URL("/", request.url), 307);
}
