import { OrganizationContext } from "@/components/organization/organization";
import { useContext } from "react";

export const useOrganization = () => {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }

  return context;
};
