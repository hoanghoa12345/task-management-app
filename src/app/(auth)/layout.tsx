import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const Layout: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <>
      <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/examples/authentication"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className={cn("absolute inset-0 bg-zinc-900", "bg-[url(https://images.pexels.com/photos/19297167/pexels-photo-19297167/free-photo-of-grossbeerenstrasse.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)]")} />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" className="w-6 h-6" width={24} height={24} alt="logo" />
              <span className="hidden font-bold md:inline-flex">{siteConfig.name}</span>
            </div>

          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout;
