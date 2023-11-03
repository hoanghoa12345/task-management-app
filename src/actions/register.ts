"use server"

import { getUserByEmail } from "@/data/users";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { RegisterSchema } from "@/schema/auth";
import bcrypt from 'bcryptjs'
import { randomUUID } from "crypto";

export async function register(formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors
    }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      message: "User already exists"
    }
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    id: randomUUID(),
    name: email.split('@')[0] || email,
    email: email,
    password: hashPassword
  });

  return { message: "Register success" }
};

