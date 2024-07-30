import { useEffect, useState } from "react";

export type Organization = {
  id: string;
  name: string;
  imageUrl: string;
  slug: string;
};

export const useOrganizationList = () => {
  const setActive = ({ organization }: { organization: string }) => {};
  const [usersMemberships, setUsersMemberships] = useState<Organization[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  return {
    setActive,
    usersMemberships,
    isLoaded,
    fetchData,
  };
};
