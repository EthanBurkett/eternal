import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/lib/models/Product";

interface ProductCardProps {
  product: IProduct;
  onAddToCart?: (product: IProduct) => void;
  className?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  className = "",
}: ProductCardProps) {
  const { name, description, price, images, stock, slug } = product;
  const mainImage = images?.[0] || "/placeholder-product.jpg";
  const isOutOfStock = stock <= 0;

  return (
    <Card className={`flex flex-col h-full overflow-hidden ${className}`}>
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={mainImage}
            alt={name}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-grow p-4">
        <CardHeader className="p-0 pb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
        </CardHeader>

        <CardContent className="p-0 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
            {description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
            {stock > 0 && (
              <span className="text-sm text-muted-foreground">
                {stock} in stock
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-0 mt-4">
          <Button
            className="w-full"
            onClick={() => onAddToCart?.(product)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

// Skeleton loader for loading states
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square w-full bg-muted rounded-t-lg" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/4 mt-4" />
      </div>
    </div>
  );
}
