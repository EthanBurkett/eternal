"use client";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function OrgCard() {
  return (
    <OrganizationSwitcher
      appearance={{
        baseTheme: dark,

        elements: {
          organizationSwitcherTrigger: "p-0 hover:bg-transparent",
          userPreview: "p-0",
          organizationPreview: "p-0",
          organizationPreviewTextContainer: "text-sm",
          organizationPreviewSecondaryIdentifier: "text-xs text-gray-500",
          organizationSwitcherPopoverActionButton: "!hidden",
        },
      }}
      hidePersonal
    />
  );
}
