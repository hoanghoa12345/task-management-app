"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { cards } from "@/db/schema";
import { Card } from "@/db/types";

const UpdateCardOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      listId: z.string(),
    })
  ),
});

type InputType = z.infer<typeof UpdateCardOrderSchema>;
type ReturnType = ActionState<InputType, Card[]>;

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

  const { items } = data;

  let updatedCards;
  try {
    updatedCards = await db.transaction(async (tx) => {
      const results: Card[] = [];
      items.forEach(async (card) => {
        await tx
          .update(cards)
          .set({
            order: card.order,
            listId: card.listId,
          })
          .where(eq(cards.id, card.id));
        const updated = await tx.query.cards.findMany({
          where: eq(cards.id, card.id),
          with: {
            list: true,
          },
        });
        results.push(...updated);
      });
      return results;
    });
  } catch (error) {
    return {
      error: "Failed to update list order.",
    };
  }
  revalidatePath(`/board/${updatedCards[0].list?.boardId}`);
  return {
    data: updatedCards,
  };
};

export const updateCardOrder = createSafeAction(UpdateCardOrderSchema, handler);
