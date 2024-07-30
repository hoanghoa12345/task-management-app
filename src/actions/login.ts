"use server";

import { getUserByEmail } from "@/data/users";
import { LoginSchema } from "@/schema/auth";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import * as z from "zod";

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const emailExists = await getUserByEmail(email);
  if (!emailExists) {
    return {
      message: "Email not found",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: callbackUrl ?? "/select-org",
    });
    return {
      success: true,
      message: "",
    };
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
          };

        default:
          return {
            message: "An error occurred",
          };
      }
    }
    return {
      message: `Error: ${(e as Error).message}`,
    };
  }
}
