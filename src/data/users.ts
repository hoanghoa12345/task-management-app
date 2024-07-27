import { db } from "@/db";

export const getUserByEmail = (email: string) => {
  const users = db.query.users.findMany({
    where: (users, { eq }) => eq(users.email, email),
  });

  return users.then((users) => users[0]);
};
