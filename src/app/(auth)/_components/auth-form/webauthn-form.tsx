"use client";

import { Button } from "@/components/ui/button";
import { KeyRound, SquareAsterisk } from "lucide-react";
import { signIn } from "next-auth/webauthn";
import { toast } from "sonner";

export const WebAuthnForm = ({
  callbackUrl,
  status,
}: {
  callbackUrl: string;
  status: string;
}) => {
  const signInWithPasskeys = () => {
    signIn("passkey", {
      callbackUrl,
      redirect: true,
    }).then((_data) => {      
      toast.success("Sign in successful");
    })
    .catch((error) => {
      toast.error(error?.message);
    });
  };

  const registerWithPasskeys = () => {
    signIn("passkey", {
      action: "register",
      redirect: false,
    })
      .then((_data) => {
        toast.success("Registration successful");
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  return (
    <div className="my-2 w-full">
      {status === "authenticated" ? (
        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={registerWithPasskeys}
        >
          <SquareAsterisk className="w-4 h-4 mr-2" /> Register new Passkey
        </Button>
      ) : status === "unauthenticated" ? (
        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={signInWithPasskeys}
        >
          <KeyRound className="w-4 h-4 mr-2" /> Sign in with Passkey
        </Button>
      ) : null}
    </div>
  );
};
