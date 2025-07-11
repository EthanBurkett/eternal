"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ICategory } from "@/lib/models/Category";
import { Fetch } from "@/lib/api-utils";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    seoTitle: "",
    seoDescription: "",
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await Fetch<ICategory>(`/api/category/${id}`);
        if (response.success) {
          const category = response.data;
          setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            image: category.image || "",
            seoTitle: category.seoTitle || "",
            seoDescription: category.seoDescription || "",
            sortOrder: category.sortOrder || 0,
            isActive: category.isActive ?? true,
          });
        } else {
          toast.error("Failed to load category");
          router.push("/manage/categories");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category");
        router.push("/manage/categories");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      toast.success("Category updated successfully");
      router.push("/manage/categories");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-gray-500">Update category details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., T-Shirts, Pants"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter a brief description of the category"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder="Optimized title for search engines"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              rows={2}
              placeholder="Description for search engines"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({ ...formData, sortOrder: Number(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/manage/categories")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
