"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import CardWrapper from "../../_components/card-wrapper/card-wrapper";
import { register } from "@/actions/register";

const RegisterPage = () => {

  return (
    <div>
      <CardWrapper title="Create an account" description="Enter your email below to create your account">
        <form method="POST" action={register} encType="multipart/form-data">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input type="email" name="email" id="email" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <Input type="password" name="password" id="password" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Input type="password" name="confirmPassword" id="confirmPassword" />
          </div>
          <p aria-live="polite" className="text-red-500"></p>
          <div className="flex flex-col gap-2">
            <Button type="submit" variant='default'>Register</Button>
            <Link href="/login">Already have an account? Login</Link>
          </div>
        </form>
      </CardWrapper>
    </div>
  );
};

export default RegisterPage;
