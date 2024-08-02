import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

const PlatformLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Toaster />
      {children}
    </SessionProvider>
  );
};

export default PlatformLayout;
