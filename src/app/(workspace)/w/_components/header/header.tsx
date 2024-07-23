import UserDropdown from "@/components/menu/user-dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { Bell, ListFilter, Rocket, Search, Zap } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Header = async () => {
  const session = await auth();

  if (!session) return redirect("/");
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 flex gap-4 h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            className="w-6 h-6"
            width={24}
            height={24}
            alt="logo"
          />
          <span className="hidden font-bold md:inline-flex">
            {siteConfig.name}
          </span>
        </Link>

        {/* Search Bar */}
        <div className="relative w-[32rem]">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <Input className="pl-8 pr-4" type="search" placeholder="Search..." />
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Filter Button */}
        <Button variant="outline" className="hidden md:inline-flex">
          <ListFilter className="w-4 h-4 mr-2 text-gray-500" />
          <span>Filter</span>
        </Button>

        <div className="flex space-x-2">
          <Button variant="ghost">
            <Rocket className="w-5 h-5 mr-2 text-gray-500" />
          </Button>

          <Button variant="ghost">
            <Zap className="w-5 h-5 mr-2 text-gray-500" />
          </Button>
          <Button variant="ghost">
            <Bell className="w-5 h-5 mr-2 text-gray-500" />
          </Button>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <UserDropdown user={session?.user as User} />
        </div>
      </div>
    </header>
  );
};

export default Header;
