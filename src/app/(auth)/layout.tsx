import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const Layout: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="relative hidden h-screen w-[502px] select-none lg:flex">
        <div
          className={cn(
            "absolute inset-0 bg-zinc-900 bg-cover bg-no-repeat bg-center",
            `bg-[url(https://images.unsplash.com/photo-1721743775338-483edf8f846f?q=80&w=1974&auto=format&fit=crop)]`
          )}
        />
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Layout;
