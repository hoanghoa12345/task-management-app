import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import LoginForm from "../../_components/auth-form/login-form";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { WebAuthnForm } from "../../_components/auth-form/webauthn-form";
import { AUTH_SERVICE_PROVIDER } from "@/utils/constants";

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
    <div className="w-[372px]">
      <LoginForm />
      <div className="my-6 h-[2px] w-full bg-zinc-100"></div>
      <form
        className="my-2 w-full "
        action={async () => {
          "use server";
          await signIn(AUTH_SERVICE_PROVIDER.id, {
            redirectTo: callbackUrl ?? "/select-org",
          });
        }}
      >
        <Button type="submit" variant="outline" className="w-full">
          <ShieldCheck className="w-4 h-4 mr-2" /> Sign in with Auth Service
        </Button>
      </form>
      <WebAuthnForm
        callbackUrl={callbackUrl ?? "/select-org"}
        status="unauthenticated"
      />
      <div className="text-sm underline text-zinc-600 flex justify-between">
        <Link href="/#forgot password">Forgot password?</Link>
        <Link href="/sign-up">Create an account</Link>
      </div>
    </div>
  );
};

export default LoginPage;
