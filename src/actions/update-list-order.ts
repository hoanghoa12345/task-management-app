"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { merge, update } from "lodash";

import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { List } from "@/db/types";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { lists } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const UpdateListOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    })
  ),
});

type InputType = z.infer<typeof UpdateListOrderSchema>;
type ReturnType = ActionState<InputType, List[]>;

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

  let updatedLists;
  try {
    // migrate from transaction to run queries sequentially
    const promises = items.map(
      (list) =>
        new Promise<List>((resolve, reject) => {
          db.update(lists)
            .set({ order: list.order })
            .where(and(eq(lists.id, list.id)))
            .returning()
            .then((list) => resolve(list[0]))
            .catch(reject);
        })
    );
    updatedLists = await Promise.all(promises);
  } catch (error) {
    console.error(`Update List Order ${error}`);
    return {
      error: "Failed to update list order.",
    };
  }
  revalidatePath(`/board/${updatedLists[0].boardId}`);
  return {
    data: updatedLists,
  };
};

export const updateListOrder = createSafeAction(UpdateListOrderSchema, handler);
