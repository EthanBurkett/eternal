import { Errors, Responses } from "@/lib/api-utils";
import { requireStaff, withMiddleware } from "@/lib/middlewares";
import { CategoryValidator } from "@/lib/models/Category";

export const GET = withMiddleware<{
  id: string;
}>(async (req, ctx) => {
  if (!ctx.models?.Category) {
    throw Errors.InternalServerError("Category model not found");
  }

  const result = await ctx.models.Category.findById(ctx.params.id);

  if (!result) {
    throw Errors.NotFound("Category not found");
  }

  return Responses.Success(result);
});

export const DELETE = withMiddleware<{ id: string }>(async (req, ctx) => {
  requireStaff(req);

  if (!ctx.models?.Category) {
    throw Errors.InternalServerError("Category model not found");
  }

  const result = await ctx.models.Category.findByIdAndDelete(ctx.params.id);

  if (!result) {
    throw Errors.NotFound("Category not found");
  }

  return Responses.Success(result);
});

export const PUT = withMiddleware<{ id: string }>(async (req, ctx) => {
  requireStaff(req);

  if (!ctx.models?.Category) {
    throw Errors.InternalServerError("Category model not found");
  }

  const body = await req.json();
  const isSafe = CategoryValidator.safeParse(body);

  if (!isSafe.success) {
    throw Errors.BadRequest("Invalid request body", {
      details: {
        ...isSafe.error.flatten().fieldErrors,
        availableFields: Object.keys(CategoryValidator.shape)
          .map(
            (key) =>
              `${key} ${
                CategoryValidator.shape[
                  key as keyof typeof CategoryValidator.shape
                ].def.type === "optional"
                  ? "(optional)"
                  : "(required)"
              }`
          )
          .join(", "),
      },
    });
  }

  const result = await ctx.models.Category.findByIdAndUpdate(ctx.params.id, {
    ...isSafe.data,
    slug: isSafe.data?.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""),
  });

  if (!result) {
    throw Errors.NotFound("Category not found");
  }

  return Responses.Success(result);
});
