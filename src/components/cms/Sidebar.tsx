"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBox, FaList, FaHome, FaCog } from "react-icons/fa";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import OrgCard from "../clerk/OrgCard";
import UserCard from "../clerk/UserCard";

export function Sidebar() {
  const pathname = usePathname();

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

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage</h1>
      </div>
      <nav className="mt-6 flex-1">
        <div className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
      <div className="p-4 border-t border-gray-200 space-y-4">
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <OrgCard />
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <UserCard />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
