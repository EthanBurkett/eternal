import { IProduct } from "@/lib/models/Product";
import { ICategory } from "@/lib/models/Category";
import { Types } from "mongoose";

type CategoryWithId = ICategory | { _id: string | Types.ObjectId; name: string };
type GroupedProducts = {
  category: CategoryWithId;
  products: IProduct[];
}[];

const UNCATEGORIZED_ID = 'uncategorized';

export function groupProductsByCategory(products: IProduct[]): GroupedProducts {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  const grouped = products.reduce<Record<string, IProduct[]>>((acc, product) => {
    const categoryId = product.category?._id?.toString() || UNCATEGORIZED_ID;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {});

  return Object.entries(grouped).map(([categoryId, products]) => {
    const category = products[0]?.category || { 
      _id: UNCATEGORIZED_ID, 
      name: 'Uncategorized' 
    };
    
    return {
      category,
      products: [...products].sort((a, b) => a.name.localeCompare(b.name))
    };
  }).sort((a, b) => {
    // Sort categories alphabetically, with Uncategorized last
    if (a.category._id === UNCATEGORIZED_ID) return 1;
    if (b.category._id === UNCATEGORIZED_ID) return -1;
    return (a.category?.name || '').localeCompare(b.category?.name || '');
  });
}
