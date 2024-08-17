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
import { ChevronsUpDown, Plus } from "lucide-react";
import { useOrganizationList } from "@/hooks/use-organization-list";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Organization } from "./organization";
import { useOrganization } from "@/hooks/use-organization";
import Image from "next/image";
import { cn } from "@/lib/utils";

const OrganizationSwitcher = () => {
  const { organization } = useOrganization();
  const { usersMemberships } = useOrganizationList();
  const router = useRouter();

  const [selectedOrganization, setSelectedOrganization] = useState<
    Organization | undefined
  >(organization);
  const organizations = usersMemberships || [];

  useEffect(() => {
    if (selectedOrganization) {
      router.push(`/organization/${selectedOrganization.id}`);
    }
  }, [selectedOrganization]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          className="flex items-center space-x-2"
        >
          {selectedOrganization ? (
            <>
              <Image
                src={selectedOrganization?.imageUrl}
                alt={selectedOrganization?.name}
                width={24}
                height={24}
                className="rounded-sm object-cover"
              />
              <span>{selectedOrganization?.name}</span>
            </>
          ) : (
            "Select Organization"
          )}

          <ChevronsUpDown className="ml-2 h-4 w-4 text-neutral-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel></DropdownMenuLabel>
        {organizations.length === 0 ? (
          <DropdownMenuLabel>No organizations found</DropdownMenuLabel>
        ) : (
          organizations.map((organization) => (
            <DropdownMenuItem
              key={organization.id}
              onClick={() => setSelectedOrganization(organization)}
              className={cn("space-x-2 font-medium", {
                "bg-sky-500/10 text-sky-700":
                  selectedOrganization?.id === organization.id,
              })}
            >
              <Image
                src={organization?.imageUrl || ""}
                alt={organization?.name || ""}
                width={32}
                height={32}
                className="rounded-sm object-cover"
              />
              <span>{organization?.name}</span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/select-org">
            {" "}
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
