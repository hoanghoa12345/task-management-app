import { OrganizationContext } from "@/components/organization/organization";
import { useContext } from "react";

export const useOrganizationList = () => {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error(
      "useOrganizationList must be used within OrganizationProvider"
    );
  }

  return context;
};
