import { create } from "@/actions/create-board";
import { db } from "@/db";
import React from "react";
import { Board } from "./_components/board";
import { Form } from "./_components/form";

const OrganizationIdPage = async () => {
  // const boards = await db.query.boards.findMany();
  const boards: any[] = [];
  return (
    <div>
      <Form />
      <div className="space-y-2">
        {boards.map((board) => (
          <Board key={board.id} title={board.title} id={board.id} />
        ))}
      </div>
    </div>
  );
};

export default OrganizationIdPage;
