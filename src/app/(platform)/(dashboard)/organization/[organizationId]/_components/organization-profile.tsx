"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, X } from "lucide-react";
import { useOrganization } from "@/hooks/use-organization";
import Image from "next/image";

export const OrganizationProfile = () => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage organization settings</CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="font-bold text-sm">Organization Profile</h4>
        <div className="flex items-center gap-x-2 py-4">
          <div className="w-[60px] h-[60px] relative">
            <Image
              fill
              src={organization?.imageUrl!}
              alt="organization"
              className="rounded-md object-cover"
            />
          </div>
          <p className="font-semibold text-md">{organization?.name}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h4 className="font-bold text-sm">Danger</h4>
          <div className="flex flex-col md:flex-row gap-x-2 gap-y-2 py-2">
            <Button type="button" size="sm" variant="outline">
              <X className="w-4 h-4 mr-2" />
              Leave organization
            </Button>
            <Button type="button" size="sm" variant="destructive">
              <X className="w-4 h-4 mr-2" />
              Delete organization
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
