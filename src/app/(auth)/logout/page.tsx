"use client";
import { useClerk } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function LogoutPage() {
  const { signOut } = useClerk();

  signOut({ redirectUrl: "/" })
    .then(() => redirect("/"))
    .catch(() => redirect("/"));

  return <div>Logging out...</div>;
}
