import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/db";

import Link from "next/link";
import React from "react";
const HomePage = async () => {
  const result = await db.query.organizations.findMany()
  // const user = await db.select().from(users).where(eq(users.email, "hoanghoa@gmail.com")).limit(1);
  // console.log('User: ', user)
  return <div>



    <h1>HomePage</h1>



    <pre>{JSON.stringify(result, null, 2)}</pre>

  </div>;
};

export default HomePage;
