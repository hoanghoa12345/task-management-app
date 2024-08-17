import { User } from "next-auth";

export const getUserName = (user: User) => {
  if (user.name) return user.name;
  if (user.email) return user.email;
  return user.id;
};
