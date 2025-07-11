"use client";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function UserCard() {
  return (
    <UserButton
      appearance={{
        baseTheme: dark,
        elements: {
          userButtonTrigger: "p-0 hover:bg-transparent",
          userPreview: "p-0",
          userButtonBox: "flex-row-reverse justify-between w-full",
          userButtonOuterIdentifier: "text-sm font-medium",
          userButtonSecondaryIdentifier: "text-xs text-gray-500",
        },
      }}
      afterSignOutUrl="/"
    />
  );
}
