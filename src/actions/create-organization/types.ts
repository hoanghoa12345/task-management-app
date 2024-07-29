import { z } from "zod";
import { CreateOrganization } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { organizations } from "@/db/schema";

export type InputType = z.infer<typeof CreateOrganization>;

export type ReturnType = ActionState<
  InputType,
  typeof organizations.$inferSelect
>;
