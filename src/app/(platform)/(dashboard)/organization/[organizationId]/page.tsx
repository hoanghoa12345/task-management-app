import { auth } from "@/lib/auth";
import React from "react";

const OrganizationIdPage = async () => {
  const session = await auth();
  if(session?.user) {
    const { name, email, image } = session?.user;
  }
  return <div>OrganizationIdPage</div>;
};

export default OrganizationIdPage;
