import { getCurrentOrganization } from "@/utils/organization";
import { OrgControl } from "./_components/org-control";
import { startCase } from "lodash";

export async function generateMetadata() {
  const organization = await getCurrentOrganization();
  
  return {
    title: startCase(organization?.name || "organization"),
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
