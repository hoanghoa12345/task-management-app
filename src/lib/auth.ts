import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import LinkedIn from "next-auth/providers/linkedin";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db";
import { LoginSchema } from "@/schema/auth";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/users";
import { getUserByEmail } from "@/data/users";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          // console.log("user", user);

          if (!user) return null;
          if (!user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;

          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
