"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBox, FaList, FaHome, FaCog, FaBars, FaTimes } from "react-icons/fa";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import OrgCard from "../clerk/OrgCard";
import UserCard from "../clerk/UserCard";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar when resizing to mobile
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      href: "/manage",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      name: "Products",
      href: "/manage/products",
      icon: <FaBox className="w-5 h-5" />,
    },
    {
      name: "Categories",
      href: "/manage/categories",
      icon: <FaList className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: "/manage/settings",
      icon: <FaCog className="w-5 h-5" />,
    },
  ];

  // Close sidebar when a link is clicked (mobile only)
  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 bottom-4 right-4 md:hidden p-3 rounded-full bg-white shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaBars className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative z-50 w-64 bg-white border-r border-gray-200 h-full flex flex-col transition-transform duration-300 ease-in-out",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0",
          isMobile ? "fixed inset-y-0 left-0" : ""
        )}
      >
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Manage</h1>
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
              aria-label="Close menu"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto">
          <div className="px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User and Organization Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="p-2 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <UserCard />
            </div>
            <div className="mt-4">
              <OrgCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
