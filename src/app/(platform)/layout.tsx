import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

const PlatformLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div>{children}</div>
    </SessionProvider>
  );
};

export default PlatformLayout;
