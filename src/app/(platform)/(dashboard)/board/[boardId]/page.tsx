import { db } from "@/db";
import { organizationIdCookie } from "@/utils/organization";
import { redirect } from "next/navigation";
import ListContainer from "./_components/board-list/container";

interface IBoardIdPageProps {
  params: {
    boardId: string;
  };
}
const BoardIdPage = async ({ params }: IBoardIdPageProps) => {
  const { orgId } = organizationIdCookie();

  if (!orgId) {
    redirect("/select-org");
  }
  const { boardId } = params;

  const lists = await db.query.lists.findMany({
    where: (lists, {eq}) => eq(lists.boardId, boardId),
    with: {
      cards: {
        orderBy: (cards: any, { asc }: any) => [asc(cards.order)],
      },
    },
    orderBy: (lists, { asc }) => [asc(lists.order)],
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer data={lists} />
    </div>
  );
};

export default BoardIdPage;