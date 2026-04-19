"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { Card } from "@/db/types";
import { auth } from "@/lib/auth";
import { boards, lists, cards } from "@/db/schema";
import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { ACTION, createAuditLog, ENTITY_TYPE } from "@/lib/create-audit-log";

const DeleteCardSchema = z.object({
  id: z.string(),
});

type InputType = z.infer<typeof DeleteCardSchema>;
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
    card = await db.query.cards.findFirst({
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
    if (!card) {
      return {
        error: "Card not found.",
      };
    }
    await db.delete(cards).where(eq(cards.id, id));
    await createAuditLog({
      action: ACTION.DELETE,
      entityId: card.id,
      entityTitle: card.title as string,
      entityType: ENTITY_TYPE.CARD,
    });
    const list = await db
      .select()
      .from(lists)
      .innerJoin(boards, eq(lists.boardId, boards.id))
      .where(and(eq(boards.organizationId, orgId), eq(lists.id, card.listId)));

    revalidatePath(`/board/${list[0].board.id}`);
    return { data: card };
  } catch (error) {
    return {
      error: "Failed to delete list.",
    };
  }
};

export const deleteCard = createSafeAction(DeleteCardSchema, handler);
