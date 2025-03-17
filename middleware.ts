import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { apiEndpoints } from "./lib/api-endpoints";
const protectedPaths = ["/dashboard"];

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-expect-error  locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.search;

  const token = request.cookies.get("idToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${searchParams}`,
        request.url,
      ),
    );
  }
  if (!token && protectedPaths.some((path) => pathname.includes(path))) {
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(apiEndpoints.refreshTokens(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY ?? "",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          const response = NextResponse.next();
          console.log("data is", data);
          response.cookies.set("idToken", data?.body?.id_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
          });
          response.cookies.set("accessToken", data?.body?.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
          });
          return response;
        } else {
          console.error("Token refresh failed:", await refreshResponse.json());
        }
      } catch (error: unknown) {
        console.log("Error@middleware refresh token", error);
      }
    }
    const locale = pathname.split("/")[1] ?? getLocale(request);
    const response = NextResponse.redirect(
      new URL(`/${locale}/signin`, request.url),
    );
    // If refresh token fails, clear invalid cookies to avoid infinite loop
    // response.cookies.delete("idToken");
    // response.cookies.delete("accessToken");
    // response.cookies.delete("refreshToken");
    return response;
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets/|images/).*)",
  ],
};
