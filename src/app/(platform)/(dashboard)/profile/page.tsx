"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { WebAuthnForm } from "@/app/(auth)/_components/auth-form/webauthn-form";

const ProfilePage = () => {
  const { data: _session, update: _, status } = useSession();

  return (
    <div className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
      <WebAuthnForm callbackUrl="/profile" status={status} />
    </div>
  );
};

export default ProfilePage;
