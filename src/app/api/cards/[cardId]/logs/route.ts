import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { auditLog, boards } from "@/db/schema";
import { ENTITY_TYPE } from "@/lib/create-audit-log";

export async function GET(
  _req: Request,
  { params }: { params: { cardId: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;
  const cookieStore = await cookies();
  const orgId = cookieStore.get("organizationId")?.value;
  if (!userId || !orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { cardId } = await params;
  try {
    const auditLogs = await db.query.auditLog.findMany({
      where: and(
        eq(auditLog.entityId, cardId),
        eq(auditLog.entityType, ENTITY_TYPE.CARD),
        inArray(
          auditLog.orgId,
          db
            .select({ id: boards.organizationId })
            .from(boards)
            .where(eq(boards.organizationId, orgId))
        )
      ),
      orderBy: (auditLog, { desc }) => [desc(auditLog.createdAt)],
      limit: 3,
    });
    const auditLogsWithDate = auditLogs.map((log) => {
      return {
        ...log,
        createdAt: log.createdAt.toISOString(),
      };
    });
    return NextResponse.json(auditLogsWithDate);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
