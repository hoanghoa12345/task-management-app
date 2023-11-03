"use client";

import React from "react";

interface CardWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const CardWrapper = ({ title, description, children }: CardWrapperProps) => {
  return <div className="bg-white p-4">
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
    <div>
      {children}
    </div>
  </div>;
};

export default CardWrapper;
