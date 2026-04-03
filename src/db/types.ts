import { boards, cards, lists } from "./schema";

export type Board = typeof boards.$inferSelect;
export type Card = typeof cards.$inferSelect & { list?: List };
export type List = typeof lists.$inferSelect;
