import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/db";

import Link from "next/link";
import React from "react";
const HomePage = async () => {
  const result = await db.query.organizations.findMany()
  
  return <div>



    <h1>HomePage</h1>



    <pre>{JSON.stringify(result, null, 2)}</pre>

  </div>;
};

export default HomePage;
