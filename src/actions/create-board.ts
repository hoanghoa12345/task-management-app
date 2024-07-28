"use server";

import { db } from "@/db";
import { boards } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
});

export async function create(prevState: State, formData: FormData) {
  const validatedFields = CreateBoard.safeParse({
    title: formData.get("title"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields",
    };
  }

  const { title } = validatedFields.data;

  // try {
  //   await db.insert(boards).values({
  //     title,
  //   });
  // } catch (error) {
  //   return {
  //     message: "Database Error",
  //   };
  // }

  revalidatePath("/organization/1");
  redirect("/organization/1");
}
