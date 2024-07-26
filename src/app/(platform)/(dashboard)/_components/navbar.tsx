import { Logo } from "@/components/logo";
import UserButton from "@/components/menu/user-button";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
const Navbar = () => {

  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      {/* Sidebar mobile */}
      <div className="flex items-center gap-x-4">
        <div>
          <Logo />
        </div>
        <Button size="sm" className="rounded-sm hidden md:block h-auto py-1.5 px-2">
          Create 
        </Button>
        <Button size='sm' className='rounded-sm block md:hidden'>
            <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        OrganizationSwitcher
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
