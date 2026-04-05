"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, desc, inArray } from "drizzle-orm";

import { db } from "@/db";
import { Card, List } from "@/db/types";
import { auth } from "@/lib/auth";
import { boards, cards, lists } from "@/db/schema";
import { ActionState, createSafeAction } from "@/lib/create-safe-action";

const CreateCardSchema = z.object({
  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Title is required.",
    })
    .min(3, { message: "Title is too short" }),
  listId: z.string(),
});

type InputType = z.infer<typeof CreateCardSchema>;
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

  const { title, listId } = data;

  let card;
  try {
    const list = await db.query.lists.findFirst({
      where: and(
        eq(lists.id, listId),
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
    if (!list) {
      return {
        error: "List not found.",
      };
    }
    const newOrder = list.cards[0]?.order ? list.cards[0]?.order + 1 : 1;

    const insertedCard = await db
      .insert(cards)
      .values({
        title,
        listId,
        order: newOrder,
      })
      .returning({ id: cards.id });

    card = await db.query.cards.findFirst({
      where: eq(cards.id, insertedCard[0].id),
      with: {
        list: {
          with: {
            board: true,
          },
        },
      },
    });
    // Audit log
  } catch (error) {
    console.error(`Create Card ${error}`);
    return {
      error: "Failed to create card.",
    };
  }
  revalidatePath(`/board/${card?.list.boardId}`);
  return {
    data: card,
  };
};

export const createCard = createSafeAction(CreateCardSchema, handler);
