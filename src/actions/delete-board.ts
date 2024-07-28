"use server";

import { db } from "@/db";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteBoard(id: string) {
  await db.delete(boards).where(eq(boards.id, id));
  revalidatePath("/organization/1");
}
