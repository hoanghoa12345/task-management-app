"use client";

import { ORGANIZATION_ID } from "@/utils/constants";
import { createContext, useEffect, useMemo, useState } from "react";

export type Organization = {
  id: string;
  name: string;
  imageUrl: string;
  slug: string;
};

type OrganizationContextType = {
  usersMemberships: Organization[];
  organization: Organization | undefined;
  isLoaded: boolean;
  setActive: ({ organizationId }: { organizationId: string }) => void;
  fetchOrganizations: () => Promise<void>;
};

export const OrganizationContext =
  createContext<OrganizationContextType | null>(null);

export const OrganizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [usersMemberships, setUsersMemberships] = useState<Organization[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [organizationId, setOrganizationId] = useState<string>();
  const organization = useMemo(
    () => usersMemberships.find((item) => item.id === organizationId),
    [usersMemberships, organizationId]
  );

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      const data = await response.json();
      setUsersMemberships(data.data.organizations);
      const storedOrgId = localStorage.getItem(ORGANIZATION_ID);
      if (storedOrgId) {
        setOrganizationId(storedOrgId);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const syncOrganizationToServer = async (orgId: string) => {
    try {
      await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });
    } catch (error) {
      console.error("Error syncing organization to server:", error);
    }
  };

  const setActive = ({ organizationId }: { organizationId: string }) => {
    setOrganizationId(organizationId);
    localStorage.setItem(ORGANIZATION_ID, organizationId);
    syncOrganizationToServer(organizationId);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        usersMemberships,
        organization,
        isLoaded,
        setActive,
        fetchOrganizations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
