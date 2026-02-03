
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname === "/conta";

  const isApi = pathname.startsWith("/api");
  if (isApi) return NextResponse.next();

  if (!isProtected) return NextResponse.next();

  const cookie = req.cookies.get("kashfy_session")?.value;
  if (!cookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/conta"]
};
