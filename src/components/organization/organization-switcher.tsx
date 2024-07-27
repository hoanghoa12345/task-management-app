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
import { useSession } from "next-auth/react";

const OrganizationSwitcher = () => {
  const { data: session } = useSession();
  // const [selectedOrganization, setSelectedOrganization] = useState(
  //   session?.user?.organizations[0]
  // );
  const [selectedOrganization, setSelectedOrganization] = useState(
    {
      id: '1',
      name: 'Personal'
    }
  );

  // const organizations = session?.user?.organizations || [];

  const organizations = [

    {
      id: '1',
      name: 'Personal'
    },
    {
      id: '2',
      name: 'Test'
    }
  ]

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
                ? "bg-primary text-white"
                : ""
            }
          >
            {organization.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a href="/organization/create">Create New Organization</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
