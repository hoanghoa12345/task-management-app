"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { List } from "@/db/types";
import { auth } from "@/lib/auth";
import { boards, lists } from "@/db/schema";
import { ActionState, createSafeAction } from "@/lib/create-safe-action";

const DeleteListSchema = z.object({
  id: z.string(),
});

type InputType = z.infer<typeof DeleteListSchema>;
type ReturnType = ActionState<InputType, List>;

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();
  const userId = session?.user?.id;
  const cookieStore = await cookies();
  const orgId = cookieStore.get("organizationId")?.value;
  if (!userId || !orgId) {
    return {
      error: "Unauthorized.",
    };
  }

  const { id } = data;

  let list;
  try {
    list = await db
      .update(lists)
      .set({
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(lists.id, id),
          inArray(
            lists.boardId,
            db
              .select({ id: boards.id })
              .from(boards)
              .where(eq(boards.organizationId, orgId))
          )
        )
      )
      .returning()
      .then((list) => list[0]);
    // Audit Log
  } catch (error) {
    return {
      error: "Failed to delete list.",
    };
  }
  revalidatePath(`/board/${list.boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteListSchema, handler);
