"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/cms/CategoryCard";
import { ICategory } from "@/lib/models/Category";
import { useEffect, useState } from "react";
import { Fetch } from "@/lib/api-utils";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Array<ICategory>>([]);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Fetch<ICategory[]>("/api/category");
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/category/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Remove the category from the list
      setCategories((prev) => prev.filter((cat) => cat._id.toString() !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500">
            Organize your products into categories
          </p>
        </div>
        <Link href="/manage/categories/create">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
          <CardDescription>
            Create and manage product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No categories found</p>
              <p className="text-sm mt-1">
                Create your first category to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category._id.toString()}
                  category={category}
                  productCount={0} // You might want to fetch the actual product count
                  onDelete={handleDelete}
                  isDeleting={deletingId === category._id.toString()}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
