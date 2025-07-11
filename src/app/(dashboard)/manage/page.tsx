"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useDocumentCount } from "@/hooks/useDocumentCount";

export default function ManagePage() {
  const { result } = useDocumentCount("Category", "Product");
  console.log(result);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Eternal Product CMS</h1>
        <p className="text-gray-500">Manage orders and products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-medium text-gray-900">Total Products</h3>
          <p className="text-3xl font-bold mt-2">
            {result?.models.find((m) => m.name === "Product")?.count}
          </p>
          <Link
            href="/manage/products"
            className="text-sm text-gray-500 mt-1 cursor-pointer hover:underline hover:text-blue-600"
          >
            Manage your products
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium text-gray-900">Categories</h3>
          <p className="text-3xl font-bold mt-2">
            {result?.models.find((m) => m.name === "Category")?.count}
          </p>
          <Link
            href="/manage/categories"
            className="text-sm text-gray-500 mt-1 cursor-pointer hover:underline hover:text-blue-600"
          >
            Organize your categories
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-3 space-y-2">
            <button className="cursor-pointer w-full text-left text-sm text-blue-600 hover:underline">
              Add New Product
            </button>
            <button className="cursor-pointer w-full text-left text-sm text-blue-600 hover:underline">
              Create Category
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
