import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const shouldTryRefresh = !accessToken && Boolean(refreshToken);

  if (shouldTryRefresh) {
    try {
      const data = await checkSession();

      if (data?.accessToken) {
        accessToken = data.accessToken;

        cookieStore.set("accessToken", data.accessToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
        });
      }

      if (data?.refreshToken) {
        cookieStore.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
        });
      }
    } catch {
      accessToken = undefined;
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
    }
  }

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};