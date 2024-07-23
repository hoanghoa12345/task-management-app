"use client";

import UserDropdown from "@/components/menu/user-dropdown";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const session = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" className="w-6 h-6" width={24} height={24} alt="logo" />
          <span className="hidden font-bold md:inline-flex">{siteConfig.name}</span>
        </div>
        {session.status === "authenticated" ? (
          <div className="flex items-center gap-2">
            <UserDropdown user={session.data.user as User} /></div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/login")}
              variant="default"
              className="px-4 hidden md:flex"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
