"use client";

import { use, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useOrganizationList } from "@/hooks/use-organization-list";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Organization } from "./organization";
import { useOrganization } from "@/hooks/use-organization";

const OrganizationSwitcher = () => {
  const { organization } = useOrganization();
  const { usersMemberships } = useOrganizationList();
  const router = useRouter();

  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | undefined>(organization);
  const organizations = usersMemberships || [];

  useEffect(() => {
    if (selectedOrganization) {
      router.push(`/organization/${selectedOrganization.id}`);
    }
  }, [selectedOrganization]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-sm">
          {selectedOrganization?.name || "Select Organization"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Select Organization</DropdownMenuLabel>
        {organizations.map((organization) => (
          <DropdownMenuItem
            key={organization.id}
            onClick={() => setSelectedOrganization(organization)}
            className={
              selectedOrganization?.id === organization.id
                ? "bg-sky-500/10 text-sky-700"
                : ""
            }
          >
            {organization.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/select-org">Create new Organization</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
