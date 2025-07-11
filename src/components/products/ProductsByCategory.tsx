import { ICategory } from "@/lib/models/Category";
import { IProduct } from "@/lib/models/Product";
import { ProductCard } from "../ProductCard";
import { Types } from "mongoose";

type CategoryWithId =
  | ICategory
  | { _id: string | Types.ObjectId; name: string };

interface ProductsByCategoryProps {
  category: CategoryWithId;
  products: IProduct[];
  onProductClick?: (product: IProduct) => void;
}

export function ProductsByCategory({
  category,
  products,
  onProductClick,
}: ProductsByCategoryProps) {
  // Ensure we have a string ID for the key
  const categoryId =
    typeof category._id === "object" ? category._id.toString() : category._id;

  return (
    <div key={categoryId} className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">
        {category.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => {
          // Ensure we have a string ID for the key
          const productId =
            typeof product._id === "object"
              ? product._id.toString()
              : product._id;
          return (
            <ProductCard
              key={productId}
              product={product}
              onAddToCart={onProductClick}
              className="h-full"
            />
          );
        })}
      </div>
    </div>
  );
}
