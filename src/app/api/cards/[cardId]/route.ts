import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { boards, cards, lists } from "@/db/schema";

export async function GET(
  _req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const cookieStore = await cookies();
    const orgId = cookieStore.get("organizationId")?.value;
    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { cardId } = await params;
    const card = await db.query.cards.findFirst({
      where: and(
        eq(cards.id, cardId),
        inArray(
          cards.listId,
          db
            .select({ id: lists.id })
            .from(lists)
            .innerJoin(boards, eq(lists.boardId, boards.id))
            .where(eq(boards.organizationId, orgId))
        )
      ),
      with: {
        list: {
          columns: {
            title: true,
          },
        },
      },
    });
    return NextResponse.json(card);
  } catch (error) {
    console.error(`Get Card ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
