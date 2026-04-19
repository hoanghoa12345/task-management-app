"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, inArray, desc } from "drizzle-orm";

import { db } from "@/db";
import { List, Card } from "@/db/types";
import { auth } from "@/lib/auth";
import { boards, lists, cards } from "@/db/schema";
import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { ACTION, createAuditLog, ENTITY_TYPE } from "@/lib/create-audit-log";

const UpdateCardSchema = z.object({
  title: z.optional(
    z
      .string({
        required_error: "Title is required.",
        invalid_type_error: "Title is required.",
      })
      .min(3, { message: "Title is too short" })
  ),
  description: z.optional(
    z
      .string({
        required_error: "Description is required.",
        invalid_type_error: "Description is required.",
      })
      .min(3, { message: "Description is too short" })
  ),
  id: z.string(),
});

type InputType = z.infer<typeof UpdateCardSchema>;
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

  const { id, ...values } = data;

  let card;
  try {
    card = await db
      .update(cards)
      .set({
        ...values,
      })
      .where(
        and(
          eq(cards.id, id),
          inArray(
            cards.listId,
            db
              .select({ id: lists.id })
              .from(lists)
              .innerJoin(boards, eq(lists.boardId, boards.id))
              .where(eq(boards.organizationId, orgId))
          )
        )
      )
      .returning();
    await createAuditLog({
      action: ACTION.UPDATE,
      entityId: card[0].id,
      entityTitle: card[0].title as string,
      entityType: ENTITY_TYPE.CARD,
    });
    const list = await db.query.lists.findFirst({
      where: and(
        eq(lists.id, card[0].listId),
        inArray(
          lists.boardId,
          db
            .select({ id: boards.id })
            .from(boards)
            .where(eq(boards.organizationId, orgId))
        )
      ),
    });

    revalidatePath(`/board/${list?.boardId}`);
    return {
      data: card[0],
    };
  } catch (error) {
    return {
      error: "Failed to update card.",
    };
  }
};

export const updateCard = createSafeAction(UpdateCardSchema, handler);
