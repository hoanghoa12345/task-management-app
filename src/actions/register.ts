"use server";

import { getUserByEmail } from "@/data/users";
import { db } from "@/db";
import { users } from "@/db/schema";
import { RegisterSchema } from "@/schema/auth";
import { getGravatarURL } from "@/utils/gavatar";
import bcrypt from "bcryptjs";
import * as z from "zod";

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      message: "User already exists",
    };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name: email,
    email: email,
    password: hashPassword,
    image: getGravatarURL(email),
  });

  return { message: "Create new account successful" };
}
