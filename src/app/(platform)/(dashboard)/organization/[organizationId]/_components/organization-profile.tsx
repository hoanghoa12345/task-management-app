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

export const OrganizationProfile = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage organization settings</CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="font-bold text-sm">Organization Profile</h4>
        <div className="flex gap-x-2 py-4">
          <Building className="w-6 h-6 text-neutral-700" />{" "}
          <span>Personal</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h4 className="font-bold text-sm">Danger</h4>
          <div className="flex space-x-2 py-2">
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
