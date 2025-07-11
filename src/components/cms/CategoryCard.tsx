import { ICategory } from "@/lib/models/Category";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: ICategory;
  productCount?: number;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function CategoryCard({
  category,
  productCount = 0,
  onDelete,
  isDeleting = false,
}: CategoryCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 bg-gray-100">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        <Badge
          variant={category.isActive ? "default" : "outline"}
          className="absolute top-2 right-2"
        >
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
        {category.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {category.description}
          </p>
        )}
        <div className="flex items-center text-sm text-gray-500">
          <span>{productCount} products</span>
          {category.sortOrder !== undefined && (
            <span className="ml-auto">Order: {category.sortOrder}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t">
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/manage/categories/edit/${category._id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(category._id.toString())}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CategoryCard;
