"use client";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { ICategory } from "@/lib/models/Category";

interface ProductWithCategory {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category?: ICategory;
}

export function ProductManagement() {
  const router = useRouter();
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts();
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  if (productsError || categoriesError) {
    return (
      <div className="p-4 text-destructive">
        <p>Error loading products or categories. Please try again later.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  // Group products by category
  const productsByCategory = products.reduce<
    Record<string, ProductWithCategory[]>
  >((acc, product) => {
    const categoryId = product.category?._id || "uncategorized";
    if (!acc[categoryId.toString()]) {
      acc[categoryId.toString()] = [];
    }
    // @ts-ignore
    acc[categoryId.toString()].push(product);
    return acc;
  }, {});

  // Add uncategorized category if needed
  if (!isLoadingProducts && products.some((p) => !p.category)) {
    // @ts-ignore
    productsByCategory["uncategorized"] = products.filter((p) => !p.category);
  }

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/product/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        // Refresh the page to show updated product list
        router.refresh();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  if (isLoadingProducts || isLoadingCategories) {
    return <ProductManagementSkeleton />;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage Products</h2>
          <p className="text-sm text-muted-foreground">
            View and manage your product inventory
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link
            href="/manage/products/create"
            className="flex items-center gap-2"
          >
            Add New Product
          </Link>
        </Button>
      </div>

      {Object.keys(productsByCategory).length > 0 ? (
        <Accordion type="multiple" className="w-full space-y-2">
          {Object.entries(productsByCategory).map(
            ([categoryId, categoryProducts]) => {
              const category =
                categoryId === "uncategorized"
                  ? { _id: "uncategorized", name: "Uncategorized" }
                  : categories.find((c) => c._id.toString() === categoryId);

              return (
                <AccordionItem
                  key={categoryId}
                  value={categoryId}
                  className="border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="cursor-pointer px-4 py-3 hover:no-underline bg-muted/50 hover:bg-muted/80 transition-colors rounded-t-lg data-[state=open]:bg-white/80 data-[state=open]:rounded-b-none">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {category?.name || "Uncategorized"}
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {categoryProducts.length}{" "}
                        {categoryProducts.length === 1 ? "item" : "items"}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4 bg-white">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categoryProducts.map((product) => (
                        <>
                          <ProductCard
                            key={product._id}
                            product={product}
                            onDelete={handleDelete}
                          />
                        </>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            }
          )}
        </Accordion>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No products found</p>
          <Button className="mt-4" asChild>
            <Link href="/manage/products/create">Add your first product</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: ProductWithCategory;
  onDelete: (id: string) => void;
}

function ProductCard({ product, onDelete }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(product._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="block h-full ">
      <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
        </div>
        <CardHeader className="flex-1 p-4">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-medium line-clamp-2">
              {product.name}
            </CardTitle>
            <div className="text-lg font-semibold whitespace-nowrap">
              ${product.price.toFixed(2)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                <Link href={`/manage/products/edit/${product._id}`}>
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

function ProductManagementSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4 border rounded-lg p-4">
          <Skeleton className="h-6 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
