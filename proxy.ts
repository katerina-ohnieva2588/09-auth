import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

const matchRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(route + "/");

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    matchRoute(pathname, route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    matchRoute(pathname, route)
  );

  const response = NextResponse.next();

  const shouldTryRefresh = !accessToken && Boolean(refreshToken);

  if (shouldTryRefresh && refreshToken) {
    try {
      const session = await checkSession();

      const data = session.data;

      if (data?.accessToken) {
        accessToken = data.accessToken;

        response.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }

      if (data?.refreshToken) {
        response.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }

      if (!data) {
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        accessToken = undefined;
      }
    } catch {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      accessToken = undefined;
    }
  }

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};