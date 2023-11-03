import { db } from "@/db";

export const getUserByEmail = (email: string) => db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, email) })
