import React from "react";
import Navbar from "./_components/navbar";
import { OrganizationProvider } from "@/components/organization/organization";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OrganizationProvider>
      <div className="h-full">
        <Navbar />

        {children}
      </div>
    </OrganizationProvider>
  );
};

export default DashboardLayout;
