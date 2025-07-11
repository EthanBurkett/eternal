"use client";

import { motion, stagger } from "motion/react";
import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { FaBook, FaPhone } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { CLERK_STAFF_ORG_ID } from "@/lib/constants";
import OrgCard from "./clerk/OrgCard";
import UserCard from "./clerk/UserCard";

const Navbar = () => {
  const [open, isOpen] = useState(false);
  const { isLoaded } = useUser();
  const { organization } = useOrganization();

  return (
    isLoaded && (
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <Link
                href="/"
                className="text-6xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text hover:text-transparent transition-colors"
              >
                ∞
              </Link>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                delayChildren: stagger(0.2),
              }}
            >
              <Link href="#story" className="nav-link">
                Our Story
              </Link>
              <Link href="#products" className="nav-link">
                Products
              </Link>
              <Link href="#contact" className="nav-link">
                Contact
              </Link>
              {organization && organization.id === CLERK_STAFF_ORG_ID && (
                <Link href="/manage" className="nav-link">
                  Manage Store
                </Link>
              )}
              {organization && <OrgCard />}
              <UserCard />
            </motion.div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Drawer open={open} onOpenChange={isOpen} direction="right">
                <DrawerTrigger className="text-white hover:text-gray-300 focus:outline-none">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Eternal</DrawerTitle>
                    <DrawerClose />
                  </DrawerHeader>
                  <DrawerContent className="flex flex-col space-y-4 p-4 bg-neutral-900 border-none shadow-lg">
                    <li className="bg-white px-4 py-2 rounded-lg font-medium flex flex-row gap-2 items-center">
                      <FaBook />
                      <Link href="#story">Our Story</Link>
                    </li>
                    <li className="bg-white px-4 py-2 rounded-lg font-medium flex flex-row gap-2 items-center">
                      <FaShop />
                      <Link href="#products">Products</Link>
                    </li>
                    <li className="bg-white px-4 py-2 rounded-lg font-medium flex flex-row gap-2 items-center">
                      <FaPhone />
                      <Link href="#contact">Contact</Link>
                    </li>
                  </DrawerContent>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </nav>
    )
  );
};

export default Navbar;
