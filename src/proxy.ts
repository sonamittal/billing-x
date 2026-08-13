import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/panel") || pathname.startsWith("/api/panel")) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, message: "Unauthorized access" },
          { status: 401 },
        );
      }
      const loginUrl = new URL("/auth/signin", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/api/panel/:path*"],
};
