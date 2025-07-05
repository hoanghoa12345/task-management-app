"use server";

import { db } from "@/db";
import { InputType, ReturnType } from "./types";
import { auth } from "@/lib/auth";
import { boards } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { UpdateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();
  const userId = session?.user?.id;
  const organizationId = cookies().get("organizationId")?.value;

  if (!userId || !organizationId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, id } = data;

  let board;

  try {
    board = await db
      .update(boards)
      .set({
        title,
      })
      .where(and(eq(boards.id, id), eq(boards.organizationId, organizationId)))
      .returning();
  } catch (e) {
    return {
      error: "Failed to update board",
    };
  }

  revalidatePath(`/board/${board[0].id}`);
  return {
    data: board[0],
  };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
