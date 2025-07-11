"use client";

import { Fetch } from "@/lib/api-utils";
import { AvailableModels } from "@/lib/middlewares";
import { useEffect, useState } from "react";

export const useDocumentCount = (...models: AvailableModels[]) => {
  const [result, setResult] = useState<{
    total: number;
    models: { name: AvailableModels; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = async () => {
    try {
      setLoading(true);
      const response = await Fetch<{
        total: number;
        models: { name: AvailableModels; count: number }[];
      }>(`/api/document-count?models=${models.join(",")}`);
      setResult(response.data);
    } catch (error) {
      setError("Failed to fetch document count");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return { result, loading, error, fetchCount };
};
