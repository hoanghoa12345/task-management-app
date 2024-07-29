import { z } from "zod";

export const CreateOrganization = z.object({
  name: z.string().min(3, {
    message: "Name is too short.",
  }),
  imageUrl: z.string().optional(),
  slug: z.string().optional(),
});
