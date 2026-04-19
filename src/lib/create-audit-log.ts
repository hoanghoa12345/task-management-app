import { db } from "@/db";
import { auth } from "./auth";
import { cookies } from "next/headers";
import { auditLog, actionEnums, entityTypeEnums } from "@/db/schema";

type ActionEnumType = (typeof actionEnums.enumValues)[number];
type EntityType = (typeof entityTypeEnums.enumValues)[number];

export const ACTION: Record<string, ActionEnumType> = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};

export const ENTITY_TYPE: Record<string, EntityType> = {
  BOARD: "board",
  LIST: "list",
  CARD: "card",
};

interface Props {
  entityId: string;
  entityType: EntityType;
  entityTitle: string;
  action: ActionEnumType;
}

export const createAuditLog = async (props: Props) => {
  try {
    const session = await auth();
    const cookieStore = await cookies();
    const orgId = cookieStore.get("organizationId")?.value;
    const user = session?.user;

    if (!user || !orgId) {
      throw new Error("User not found!!");
    }
    const { entityId, entityTitle, entityType, action } = props;

    await db.insert(auditLog).values({
      orgId,
      entityId,
      entityType,
      entityTitle,
      userId: user.id!,
      action,
      userImage: user.image,
      userName: user.name,
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
};
