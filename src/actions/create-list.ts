"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, desc } from "drizzle-orm";

import { db } from "@/db";
import { List } from "@/db/types";
import { auth } from "@/lib/auth";
import { boards, lists } from "@/db/schema";
import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { ACTION, createAuditLog, ENTITY_TYPE } from "@/lib/create-audit-log";

const CreateListSchema = z.object({
  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Title is required.",
    })
    .min(3, { message: "Title is too short" }),
  boardId: z.string(),
});

type InputType = z.infer<typeof CreateListSchema>;
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

  const { title, boardId } = data;

  let list;
  try {
    const board = await db.query.boards.findFirst({
      where: and(eq(boards.id, boardId), eq(boards.organizationId, orgId)),
      with: {
        lists: {
          orderBy: desc(lists.order),
        },
      },
    });

    if (!board) {
      return {
        error: "Board not found.",
      };
    }
    const newOrder = board.lists[0]?.order ? board.lists[0]?.order + 1 : 1;

    list = await db
      .insert(lists)
      .values({
        title,
        boardId,
        order: newOrder,
      })
      .returning()
      .then((result) => result[0]);

    await createAuditLog({
      action: ACTION.CREATE,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: list.title as string,
    });
  } catch (error) {
    console.log(`Create List ${error}`);
    return {
      error: "Failed to create list.",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const createList = createSafeAction(CreateListSchema, handler);
