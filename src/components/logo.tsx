import Image from "next/image";
import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from '@/lib/utils'
import localFont from 'next/font/local'

const headingFont = localFont({
  src: '../../public/fonts/Montserrat-Regular.woff2'
})

export const Logo = () => {
  return (
    <Link href='/'>
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex" >
        <Image src='/logo.svg' alt='Logo' width={30} height={30} />
        <p className={cn("text-lg text-neutral-700 pb-1", headingFont.className)}>{siteConfig.name}</p>
      </div>
    </Link>
  )
}
