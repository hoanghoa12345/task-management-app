"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlignStartHorizontal,
  LayoutGrid,
  LayoutPanelLeft,
  LogOut,
  PanelsTopLeft,
  Settings,
  Star,
  User,
  Wand2,
} from "lucide-react";
import React from "react";

interface NavItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isActive?: boolean;
}

const Sidebar = (props: React.HTMLAttributes<HTMLElement>) => {
  return (
    <aside className="-translate-x-full sm:translate-x-0 transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 w-16 border-e border-border/40 pt-14 pb-2 overflow-y-auto md:block md:translate-x-0 md:end-auto md:bottom-0" {...props}>
      <nav className="h-full flex flex-col">
        <div className="flex flex-col">
          {/* Sidebar Base */}
          <Sidebar.NavItem isActive onClick={() => console.log('ok')}>
            <LayoutGrid className="w-6 h-6" />
            {/* <span className="ml-2">Dashboard</span> */}
          </Sidebar.NavItem>
          <Sidebar.NavItem>
            <LayoutPanelLeft className="w-6 h-6 text-gray-500" />
            {/* <span className="ml-2">Layout</span> */}
          </Sidebar.NavItem>
          <Sidebar.NavItem>
            <PanelsTopLeft className="w-6 h-6 text-gray-500" />
            {/* <span className="ml-2">Components</span> */}
          </Sidebar.NavItem>
          <Sidebar.NavItem>
            <User className="w-6 h-6 text-gray-500" />
            {/* <span className="ml-2">Users</span> */}
          </Sidebar.NavItem>
          <Sidebar.NavItem>
            <Star className="w-6 h-6 text-gray-500" />
            {/* <span className="ml-2">Ratings</span> */}
          </Sidebar.NavItem>
          <Sidebar.NavItem>
            <Wand2 className="w-6 h-6 text-gray-500" />
            {/* <span className="ml-2">Wands</span> */}
          </Sidebar.NavItem>
          <Sidebar.NavItem>
            <Settings className="w-6 h-6 text-gray-500" />
            {/* <span className="ml-2">Settings</span> */}
          </Sidebar.NavItem>
        </div>
        <div className="flex-1" />
        {/* Sidebar Base */}
        <div className="flex flex-col">
          <Sidebar.NavItem>
            <LogOut className="w-6 h-6 text-gray-500" />
            {/* <span className="ml-2">Logout</span> */}
          </Sidebar.NavItem>
        </div>
      </nav>
    </aside>
  );
};

const NavItem: React.FC<NavItemProps> = ({ children, isActive, ...restProps }) => {
  return (
      <button className={cn("h-12 w-12 rounded-md mx-2 my-2 inline-flex justify-center items-center hover:bg-secondary",isActive ? "bg-blue-600 text-white hover:text-gray-400" : "")} {...restProps}>
        {children}
      </button>
  );
};

Sidebar.NavItem = NavItem;

export default Sidebar;
