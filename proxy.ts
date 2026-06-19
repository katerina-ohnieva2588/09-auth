import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const handleRefresh = async () => {
    const res = await checkServerSession();

    const setCookie = res.headers["set-cookie"];
    if (!setCookie) return false;

    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

    for (const cookieStr of cookieArray) {
      const parsed = parse(cookieStr);

      if (parsed.accessToken) {
        request.cookies.set?.("accessToken", parsed.accessToken);
      }

      if (parsed.refreshToken) {
        request.cookies.set?.("refreshToken", parsed.refreshToken);
      }
    }

    return true;
  };

  if (isPrivateRoute) {
    if (accessToken) return NextResponse.next();

    if (refreshToken) {
      const ok = await handleRefresh();
      if (ok) return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    if (refreshToken) {
      const ok = await handleRefresh();
      if (ok) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};