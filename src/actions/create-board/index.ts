"use server";

import { db } from "@/db";
import { InputType, ReturnType } from "./types";
import { auth } from "@/lib/auth";
import { boards } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { cookies } from "next/headers";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();
  const userId = session?.user?.id;
  const organizationId = cookies().get("organizationId")?.value;

  if (!userId || !organizationId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, image } = data;

  const [
    imageId,
    imageThumbnailUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUsername,
  ] = image.split("|");

  if (
    !imageId ||
    !imageThumbnailUrl ||
    !imageFullUrl ||
    !imageUsername ||
    !imageLinkHTML
  ) {
    return {
      error: "Missing fields. Failed to create board.",
    };
  }

  let board;

  try {
    board = await db
      .insert(boards)
      .values({
        organizationId,
        title,
        imageId,
        imageThumbnailUrl,
        imageFullUrl,
        imageUsername,
        imageLinkHTML,
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
