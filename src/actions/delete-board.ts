"use server";

import { db } from "@/db";
import { boards } from "@/db/schema";
import { auth } from "@/lib/auth";
import { Board } from "@/db/types";
import { ActionState, createSafeAction } from "@/lib/create-safe-action";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type InputType = z.infer<typeof DeleteBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;

export const DeleteBoardSchema = z.object({
  id: z.string(),
});

// export async function deleteBoard(id: string) {
//   await db.delete(boards).where(eq(boards.id, id));
//   revalidatePath("/organization/1");
// }

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();
  const userId = session?.user?.id;
  const orgId = cookies().get("organizationId")?.value;

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;

  let board;
  try {
    board = await db
      .update(boards)
      .set({
        deletedAt: new Date(),
      })
      .where(and(eq(boards.id, id), eq(boards.organizationId, orgId)));
    // if (!isPro) decreaseAvailableCount();
    // await createAuditLog({
    //   action: ACTION.DELETE,
    //   entityId: board.id,
    //   entityTitle: board.title,
    //   entityType: ENTITY_TYPE.BOARD,
    // });
  } catch (error) {
    return {
      error: "Failed to delete board.",
    };
  }
  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoardSchema, handler);
