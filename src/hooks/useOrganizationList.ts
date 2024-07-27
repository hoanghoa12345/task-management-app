export const useOrganizationList = () => {
  const setActive = ({ organization }: { organization: string }) => {};
  let usersMemberships: any[] = [
    {
      id: "1",
      name: "Personal",
      imageUrl: "https://picsum.photos/200/200",
      slug: "personal",
    },
    {
      id: "2",
      name: "Team",
      imageUrl: "https://picsum.photos/200/200",
      slug: "team",
    },
  ];
  let isLoaded: boolean = true;

  return {
    setActive,
    usersMemberships,
    isLoaded,
  };
};
