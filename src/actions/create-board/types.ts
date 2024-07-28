import { z } from "zod";
import { CreateBoard } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { boards } from "@/db/schema";

export type InputType = z.infer<typeof CreateBoard>;

export type ReturnType = ActionState<InputType, typeof boards.$inferSelect>;
