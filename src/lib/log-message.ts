import { AuditLog } from "@/db/types";

export const ACTION: Record<string, string> = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case ACTION.CREATE:
      return `created ${entityType!.toLowerCase()} "${entityTitle}".`;
    case ACTION.UPDATE:
      return `updated ${entityType!.toLowerCase()} "${entityTitle}".`;
    case ACTION.DELETE:
      return `deleted ${entityType!.toLowerCase()} "${entityTitle}".`;
    default:
      return `unknown action ${entityType!.toLowerCase()} "${entityTitle}".`;
  }
};
