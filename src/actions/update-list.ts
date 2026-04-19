"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { List } from "@/db/types";
import { auth } from "@/lib/auth";
import { boards, lists } from "@/db/schema";
import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { ACTION, createAuditLog, ENTITY_TYPE } from "@/lib/create-audit-log";

const UpdateListSchema = z.object({
  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Title is required.",
    })
    .min(3, { message: "Title is too short" }),
  listId: z.string(),
});

type InputType = z.infer<typeof UpdateListSchema>;
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

  const { title, listId } = data;

  let list;
  try {
    list = await db
      .update(lists)
      .set({
        title,
      })
      .where(
        and(
          eq(lists.id, listId),
          eq(
            lists.boardId,
            db
              .select({ id: boards.id })
              .from(boards)
              .where(eq(boards.organizationId, orgId))
          )
        )
      )
      .returning()
      .then((result) => result[0]);

    await createAuditLog({
      action: ACTION.UPDATE,
      entityId: list.id,
      entityTitle: list.title as string,
      entityType: ENTITY_TYPE.LIST,
    });
  } catch (error) {
    return {
      error: "Failed to update list.",
    };
  }
  revalidatePath(`/board/${list.boardId}`);
  return {
    data: list,
  };
};

export const updateList = createSafeAction(UpdateListSchema, handler);
