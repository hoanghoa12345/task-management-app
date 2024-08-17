"use client";

import { useOrganizationList } from "@/hooks/use-organization-list";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const OrgControl = () => {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive || !params.organizationId) return;

    setActive({ organization: params.organizationId as string });
  }, [setActive, params.organizationId]);

  return null;
};
