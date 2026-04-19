"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, inArray, desc } from "drizzle-orm";

import { db } from "@/db";
import { Card } from "@/db/types";
import { auth } from "@/lib/auth";
import { boards, lists, cards } from "@/db/schema";
import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { ACTION, createAuditLog, ENTITY_TYPE } from "@/lib/create-audit-log";

const CopyCardSchema = z.object({
  id: z.string(),
});

type InputType = z.infer<typeof CopyCardSchema>;
type ReturnType = ActionState<InputType, Card>;

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

  let card;
  try {
    const copiedCard = await db.query.cards.findFirst({
      where: and(
        eq(cards.id, id),
        inArray(
          cards.listId,
          db
            .select({ id: lists.id })
            .from(lists)
            .innerJoin(boards, eq(lists.boardId, boards.id))
            .where(eq(boards.organizationId, orgId))
        )
      ),
    });

    if (!copiedCard) {
      return {
        error: "Card not found.",
      };
    }

    const lastCard = await db
      .select({
        order: cards.order,
      })
      .from(cards)
      .where(eq(cards.listId, copiedCard.listId))
      .orderBy(desc(cards.order))
      .limit(1)
      .then((cards) => cards[0]);

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db
      .insert(cards)
      .values({
        title: copiedCard.title + " - Copy",
        order: newOrder,
        listId: copiedCard.listId,
        description: copiedCard.description,
      })
      .returning();
    await createAuditLog({
      action: ACTION.CREATE,
      entityId: card[0].id,
      entityTitle: card[0].title as string,
      entityType: ENTITY_TYPE.CARD,
    });
    const board = await db.query.boards.findFirst({
      where: and(
        eq(
          boards.id,
          db
            .select({ id: lists.boardId })
            .from(lists)
            .where(eq(lists.id, card[0].listId))
            .limit(1)
        ),
        eq(lists.id, card[0].listId),
        eq(boards.organizationId, orgId)
      ),
    });
    if (!board) {
      return {
        error: "Board not found.",
      };
    }
    await createAuditLog({
      action: ACTION.CREATE,
      entityId: board.id,
      entityTitle: board.title as string,
      entityType: ENTITY_TYPE.BOARD,
    });
    revalidatePath(`/board/${board.id}`);
    return { data: card[0] };
  } catch (error) {
    return {
      error: "Failed to copy card.",
    };
  }
};

export const copyCard = createSafeAction(CopyCardSchema, handler);
