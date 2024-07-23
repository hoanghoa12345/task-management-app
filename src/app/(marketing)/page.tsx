import Image from "next/image";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import Navbar from "./_components/navbar/navbar";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

const MarketingPage = async () => {
  const session = await auth();

  return (
    <>
      <SessionProvider>
        <Navbar />
      </SessionProvider>
      <div className="flex items-center justify-center flex-col bg-background">
        <div className="flex items-center justify-center flex-col mt-20">
          <div className="my-4">
            <Image
              src="/logo.svg"
              alt="logo"
              className="w-32 h-32"
              width={100}
              height={100}
            />
          </div>
          <p className="font-semibold">No 1 task management</p>
          <h2 className="text-3xl font-bold">
            {siteConfig.name} helps team move work forward.
          </h2>
        </div>
        <div className="flex justify-center align-center my-4">
          {session?.user ? (
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/w"
            >
              Go to workspace
            </Link>
          ) : (
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/login"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MarketingPage;
