import { db } from "@/db";
import { boards } from "@/db/schema";
import { organizationIdCookie } from "@/utils/organization";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import React from "react";
// import BoardNavbar from "./_components/board-navbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = organizationIdCookie();

  if (!orgId) {
    return {
      title: "board",
    };
  }

  const board = await db
    .select()
    .from(boards)
    .where(and(eq(boards.id, params.boardId), eq(boards.organizationId, orgId)))
    .limit(1)
    .then((data) => data[0])
    .catch(() => null);

  return {
    title: board?.title || "Board",
  };
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId } = organizationIdCookie();
  const { boardId } = params;
  if (!orgId) {
    redirect("/select-org");
  }

  const board = await db
    .select()
    .from(boards)
    .where(and(eq(boards.id, boardId), eq(boards.organizationId, orgId)))
    .limit(1)
    .then((data) => data[0])
    .catch(() => null);

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      {/* <BoardNavbar board={board} /> */}
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
