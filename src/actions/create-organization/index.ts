"use server";

import { db } from "@/db";
import { InputType, ReturnType } from "./types";
import { auth } from "@/lib/auth";
import { organizations } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { CreateOrganization } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { name, imageUrl, slug } = data;

  let newOrganization;

  try {
    newOrganization = await db
      .insert(organizations)
      .values({
        userId,
        name,
        imageUrl,
        slug,
      })
      .returning();
  } catch (e) {
    return {
      error: "Failed to create organization",
    };
  }

  revalidatePath("/select-org");
  return {
    data: newOrganization[0],
  };
};

export const createOrganization = createSafeAction(CreateOrganization, handler);
