import React from "react";
import { Metadata } from "next";
import KanbanBoard from "@/components/kanban/kanban-board";


export const metadata: Metadata = {
  title: "Workspaces",
};

const WorkspacesPage = () => {
  return (
    <div>Workspace page

      <KanbanBoard/>
    </div>
  );
};

export default WorkspacesPage;
