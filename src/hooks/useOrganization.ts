export const useOrganization = () => {
  let organization = {
    id: "1",
    name: "Personal",
    imageUrl: "https://photos.picsum/200/200",
    slug: "personal",
  };
  let isLoaded: boolean = true;

  return {
    organization,
    isLoaded,
  };
};
