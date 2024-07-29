import { useEffect, useState } from "react";

export const useOrganizationList = () => {
  const setActive = ({ organization }: { organization: string }) => {};
  const [usersMemberships, setUsersMemberships] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
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

    fetchData();
  }, []);

  return {
    setActive,
    usersMemberships,
    isLoaded,
  };
};
