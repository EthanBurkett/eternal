"use client";

import { APIResponse, Fetch } from "@/lib/api-utils";
import { ICategory } from "@/lib/models/Category";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery<APIResponse<ICategory[]>, Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await Fetch<ICategory[]>("/api/category");
      return response;
    },
  });
};
