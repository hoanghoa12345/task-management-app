"use server";

import { db } from "@/db";
import { InputType, ReturnType } from "./types";
import { auth } from "@/lib/auth";
import { boards } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title } = data;

  let board;

  try {
    board = await db
      .insert(boards)
      .values({
        title,
        organizationId: "",
      })
      .returning();
  } catch (e) {
    return {
      error: "Failed to create board",
    };
  }

  revalidatePath(`/board/${board[0].id}`);
  return {
    data: board[0],
  };
};

export const createBoard = createSafeAction(CreateBoard, handler);
