import React from "react";
import OrganizationList from "./_components/organization-list";
import SelectOrganization from "./_components/select-organization";

export default function CreateOrganizationPage() {
  return (
    <div className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
      {/* <OrganizationList /> */}
      <SelectOrganization />
    </div>
  );
}
