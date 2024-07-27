"use client";

import { useState } from "react";
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
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizationList } from "@/hooks/useOrganizationList";
import Link from "next/link";

const OrganizationSwitcher = () => {
  const { organization } = useOrganization();
  const { usersMemberships } = useOrganizationList();

  const [selectedOrganization, setSelectedOrganization] = useState(
    organization || null
  );
  const organizations = usersMemberships || [];

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
          <Link href="/organization/create">Create new Organization</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
