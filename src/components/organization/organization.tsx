"use client";

import { ORGANIZATION_ID } from "@/utils/constants";
import { createContext, useEffect, useState } from "react";
import { useCookie } from "react-use";

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
  setActive: ({ organization }: { organization: string }) => void;
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
  const [organization, setOrganization] = useState<Organization>();
  const [_value, updateCookie, _deleteCookie] = useCookie(ORGANIZATION_ID);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      const data = await response.json();
      setUsersMemberships(data.data.organizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setActive = ({ organization }: { organization: string }) => {
    const selectedOrganization = usersMemberships.find(
      (item) => item.id === organization
    );
    setOrganization(selectedOrganization);
    updateCookie(selectedOrganization?.id!);
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
