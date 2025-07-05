"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { useOrganizationList } from "@/hooks/use-organization-list";
import { OrganizationCard } from "./organization-card";
import { useRouter } from "next/navigation";

const OrganizationList = () => {
  const { usersMemberships } = useOrganizationList();
  const organizations = usersMemberships || [];
  

  const router = useRouter();
 

  const onNewOrganization = () => {
    router.push("/select-org/new");
  };

  return (
    <div className="flex flex-1 w-full overflow-y-hidden">
      <div className="mx-auto w-full px-4 my-2 max-w-6xl flex flex-col gap-8">
        <div className="flex-grow h-full overflow-y-auto">
          <h1 className="text-2xl">Your Organizations</h1>
        </div>
        <div className="flex items-center gap-x-2">
          <Button onClick={onNewOrganization} variant={"primary"}>
            New organization
          </Button>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map((organization) => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationList;
