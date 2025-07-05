import { Organization } from "@/components/organization/organization";
import Image from "next/image";
import Link from "next/link";

interface OrganizationCardProps {
  organization: Organization;
}

export const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  return (
    <Link href={`/organization/${organization.id}`}>
      <div className="rounded-lg text-card-foreground shadow-sm bg-card grow p-3 transition-colors hover:bg-accent border border-light hover:border-default cursor-pointer flex items-center min-h-20 w-full">
        <div className="relative flex items-start gap-3">
          <div>
            <Image
              src={organization.imageUrl}
              alt={organization.name}
              width={48}
              height={48}
              className="rounded-sm object-cover"
            />
          </div>
          <div className="flex flex-col gap-0 w-full">
            <h3 className="text-sm text-foreground mb-0">
              {organization.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};
