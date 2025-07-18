import { Errors, Responses, ZodErrorFormatter } from "@/lib/api-utils";
import { requireStaff, withMiddleware } from "@/lib/middlewares";
import { ProductValidator } from "@/lib/models/Product";

export const GET = withMiddleware<{ id: string }>(async (req, ctx) => {
  if (!ctx.models?.Product) {
    throw Errors.InternalServerError("Product model not found");
  }

  const params = await ctx.params;

  const result = await ctx.models.Product.findById(params.id).populate(
    "category"
  );

  if (!result) {
    throw Errors.NotFound("Product not found");
  }

  return Responses.Success(result);
});

export const DELETE = withMiddleware<{ id: string }>(async (req, ctx) => {
  requireStaff(req);

  const params = await ctx.params;

  if (!ctx.models?.Product) {
    throw Errors.InternalServerError("Product model not found");
  }

  const result = await ctx.models.Product.findByIdAndDelete(params.id);

  if (!result) {
    throw Errors.NotFound("Product not found");
  }

  return Responses.Success(result);
});

export const PUT = withMiddleware<{ id: string }>(async (req, ctx) => {
  requireStaff(req);

  if (!ctx.models?.Product) {
    throw Errors.InternalServerError("Product model not found");
  }

  const body = await req.json();

  const isSafe = ProductValidator.safeParse(body);

  if (!isSafe.success) {
    throw Errors.BadRequest("Invalid request body", {
      details: ZodErrorFormatter(ProductValidator, isSafe.error),
    });
  }

  const params = await ctx.params;

  const product = await ctx.models.Product.findByIdAndUpdate(params.id, {
    ...isSafe.data,
    slug: isSafe.data?.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""),
  });

  if (!product) {
    throw Errors.NotFound("Product not found");
  }

  return Responses.Success(product);
});
