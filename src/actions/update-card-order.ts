"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { eq, inArray } from "drizzle-orm";

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
    const promises = items.map(
      (card) =>
        new Promise<Card>((resolve, reject) => {
          db.update(cards)
            .set({
              order: card.order,
              listId: card.listId,
            })
            .where(eq(cards.id, card.id))
            .returning()
            .then((card) => resolve(card[0]))
            .catch(reject);
        })
    );
    updatedCards = await Promise.all(promises);
    const cardIds = updatedCards.map((card) => card.id);
    updatedCards = await db.query.cards.findMany({
      where: inArray(cards.id, cardIds),
      with: {
        list: true,
      },
    });
  } catch (error) {
    console.error(`Update Card Order ${error}`);
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
