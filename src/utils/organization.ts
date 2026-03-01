import { cookies } from "next/headers";
import { ORGANIZATION_ID } from "./constants";
import { db } from "@/db";

export async function getCurrentOrganization() {
  const cookieStore = await cookies();
  const organizationId = cookieStore.get(ORGANIZATION_ID);

  if (!organizationId) return null;
  const organizations = db.query.organizations.findMany({
    where: (organizations, { eq }) =>
      eq(organizations.id, organizationId.value),
  });

  return organizations.then((organizations) => organizations[0]);
}

export async function organizationIdCookie() {
  const cookieStore = await cookies();
  const orgIdCookie = cookieStore.get(ORGANIZATION_ID);
  return {
    orgId: orgIdCookie?.value,
  };
}
