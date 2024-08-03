import NextAuth, { AuthError } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db";
import { LoginSchema } from "@/schema/auth";
import { getUserByEmail } from "@/data/users";
import bcrypt from "bcryptjs";
import Passkey from "next-auth/providers/passkey";
import { AUTH_SERVICE_PROVIDER } from "@/utils/constants";

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

          if (!user) {
            throw new AuthError("User not found.");
          }
          if (!user?.password) {
            throw new AuthError("User not authenticate with credential.");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;

          return null;
        }
        return null;
      },
    }),
    {
      id: AUTH_SERVICE_PROVIDER.id,
      name: AUTH_SERVICE_PROVIDER.name,
      type: "oidc",
      wellKnown: `${process.env.AUTH_PROVIDER_URL}/.well-known/openid-configuration`,
      issuer: process.env.AUTH_PROVIDER_ISSUER,
      authorization: `${process.env.AUTH_PROVIDER_URL}/auth`,
      token: `${process.env.AUTH_PROVIDER_URL}/token`,
      userinfo: `${process.env.AUTH_PROVIDER_URL}/me`,
      async profile(profile, _tokens) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      checks: ["pkce", "state"],
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    },
    Passkey,
  ],
  pages: {
    signIn: "/sign-in",
    error: "/error",
    signOut: "/sign-out",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  experimental: { enableWebAuthn: true },
});
