import React from "react";
import Sidebar from "./_components/sidebar/sidebar";
import Header from "./_components/header/header";

const WorkspaceLayout = ({
  children: childrenProp,
  ...restProps
}: {
  children: React.ReactNode;
  [key: string]: any;
} & React.HTMLAttributes<HTMLDivElement> &
  React.RefAttributes<HTMLDivElement>) => {
  return (
    <div {...restProps}>
      <Header />
      <div className="flex h-full">
        <Sidebar />
        <div className="w-full px-4 sm:px-6 md:ps-16">{childrenProp}</div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
