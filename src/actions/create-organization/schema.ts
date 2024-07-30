import { z } from "zod";

export const CreateOrganization = z.object({
  name: z.string().min(3, {
    message: "Name is too short.",
  }),
  imageUrl: z.string().min(3),
  slug: z.string().min(3),
});
