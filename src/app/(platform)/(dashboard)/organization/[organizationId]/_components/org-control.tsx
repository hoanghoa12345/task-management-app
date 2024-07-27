"use client";

import { useOrganizationList } from "@/hooks/useOrganizationList";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const OrgControl = () => {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    setActive({ organization: params.organizationId as string });
  }, [setActive, params.organizationId]);

  return null;
};
