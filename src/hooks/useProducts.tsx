"use client";

import { APIResponse, Fetch } from "@/lib/api-utils";
import { IProduct } from "@/lib/models/Product";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  return useQuery<APIResponse<IProduct[]>, Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await Fetch<IProduct[]>(
        "/api/product?populate=category"
      );
      return response;
    },
  });
};
