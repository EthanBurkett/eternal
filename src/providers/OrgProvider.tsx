"use client";

import { CLERK_STAFF_ORG_ID } from "@/lib/constants";
import { useOrganization } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const IsStaffProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { organization, isLoaded } = useOrganization();

  if (isLoaded && organization?.id === CLERK_STAFF_ORG_ID) {
    return <>{children}</>;
  }
  return isLoaded && redirect("/");
};
