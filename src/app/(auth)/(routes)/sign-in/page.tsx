import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import LoginForm from "../../_components/login-form/login-form";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign In to your account",
};

const LoginPage = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const { callbackUrl } = searchParams ?? { callbackUrl: "" };

  return (
    <div>
      <LoginForm />
      <form
        className="mx-4 my-2"
        action={async () => {
          "use server";
          await signIn("hoadev-auth-service", {
            redirectTo: callbackUrl ?? "/",
          });
        }}
      >
        <Button type="submit" variant="outline">
          <ShieldCheck className="w-4 h-4 mr-2" /> Sign In With Auth Service
        </Button>
      </form>
      <div className="text-sm mx-4">
        <span className="mr-1">Create an account</span>
        <Link className="font-semibold" href="/sign-up">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
