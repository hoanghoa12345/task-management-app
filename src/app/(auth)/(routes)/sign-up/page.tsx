import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import CardWrapper from "../../_components/card-wrapper/card-wrapper";
import { register } from "@/actions/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register your account",
};

const RegisterPage = () => {
  return (
    <div>
      <CardWrapper
        title="Create an account"
        description="Enter your email below to create your account"
      >
        <form className="mt-2" method="POST" action={register}>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500" htmlFor="email">
              Email
            </label>
            <Input type="email" name="email" id="email" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500" htmlFor="password">
              Password
            </label>
            <Input type="password" name="password" id="password" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
            />
          </div>
          <p aria-live="polite" className="text-sm text-red-500"></p>
          <div className="flex flex-col gap-2">
            <Button className="mt-2" type="submit" variant="default">
              Register
            </Button>
            <div className="text-sm py-2">
              <span>Already have an account?</span>{" "}
              <Link className="font-semibold" href="/sign-in">
                Login
              </Link>
            </div>
          </div>
        </form>
      </CardWrapper>
    </div>
  );
};

export default RegisterPage;
