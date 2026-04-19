"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, inArray, desc } from "drizzle-orm";

import { db } from "@/db";
import { List } from "@/db/types";
import { auth } from "@/lib/auth";
import { boards, lists, cards } from "@/db/schema";
import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { ACTION, createAuditLog, ENTITY_TYPE } from "@/lib/create-audit-log";

const CopyListSchema = z.object({
  id: z.string(),
});

type InputType = z.infer<typeof CopyListSchema>;
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
    const copiedList = await db.query.lists.findFirst({
      where: and(
        eq(lists.id, id),
        inArray(
          lists.boardId,
          db
            .select({ id: boards.id })
            .from(boards)
            .where(eq(boards.organizationId, orgId))
        )
      ),
      with: {
        cards: {
          orderBy: desc(cards.order),
        },
      },
    });
    if (!copiedList) {
      return {
        error: "List not found.",
      };
    }

    const newListOrder = copiedList.cards[0]?.order
      ? copiedList.cards[0]?.order + 1
      : 1;

    const list = await db
      .insert(lists)
      .values({
        title: `${copiedList.title} - Copy`,
        boardId: copiedList.boardId,
        order: newListOrder,
      })
      .returning();

    await db.insert(cards).values(
      copiedList.cards.map((card) => ({
        title: card.title,
        description: card.description,
        listId: list[0].id,
        order: card.order,
      }))
    );

    await createAuditLog({
      action: ACTION.CREATE,
      entityId: list[0].id,
      entityTitle: list[0].title as string,
      entityType: ENTITY_TYPE.LIST,
    });
    revalidatePath(`/board/${list[0]?.boardId}`);
    return { data: list[0] };
  } catch (error) {
    return {
      error: "Failed to copy list",
    };
  }
};

export const copyList = createSafeAction(CopyListSchema, handler);
