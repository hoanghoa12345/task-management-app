import React from "react";

interface IListWrapperProps {
  children: React.ReactNode;
}
const ListWrapper = ({ children }: IListWrapperProps) => {
  return (
    <li className="shrink-0 h-4 w-68 select-none">{children}</li>
  );
};

export default ListWrapper;