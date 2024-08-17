import { Logo } from "@/components/logo";
import UserButton from "@/components/menu/user-button";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

export const Navbar = async () => {
  const session = await auth();
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 mb:block md:w-auto flex items-center justify-between w-full">
          {session?.user ? (
            <>
              <Button asChild variant="outline">
                <Link href="/select-org">Enter {siteConfig.name}</Link>
              </Button>

              <SessionProvider session={session}>
                <UserButton />
              </SessionProvider>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get {siteConfig.name} for free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
