import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/** Refreshes the Supabase session cookie and keeps signed-out users out of /admin. Authorization (admin role)
 *  is enforced again on the server for every admin page, action and export, and by Row Level Security. */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = req.nextUrl.pathname.startsWith("/admin/login");
  if (!url || !key) return isLogin ? res : NextResponse.redirect(new URL("/admin/login?e=config", req.url));
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && !isLogin) {
    const to = new URL("/admin/login", req.url);
    to.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(to);
  }
  if (user && isLogin) return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  return res;
}
export const config = { matcher: ["/admin/:path*"] };
