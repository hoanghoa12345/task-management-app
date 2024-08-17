import { auth } from "@/lib/auth";
import { ORGANIZATION_ID } from "./utils/constants";

const authRoutes = ["/sign-in", "/sign-up"];
const publicRoutes = ["/", ...authRoutes];

export default auth((req) => {
  if (!req.auth && !publicRoutes.includes(req.nextUrl.pathname)) {
    let searchParams = new URLSearchParams({
      callbackUrl: req.nextUrl.toString(),
    });
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    newUrl.search = searchParams.toString();
    return Response.redirect(newUrl);
  }
  if (req.auth && authRoutes.includes(req.nextUrl.pathname)) {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }

  const organizationId = req.cookies.get(ORGANIZATION_ID);
  if (req.auth && publicRoutes.includes(req.nextUrl.pathname)) {
    let path = "/select-org";
    if (organizationId) {
      path = `/organization/${organizationId.value}`;
    }
    console.log(path);
    const selectOrgUrl = new URL(path, req.nextUrl.origin);
    return Response.redirect(selectOrgUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)"],
};
