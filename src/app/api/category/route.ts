import { Errors, Responses } from "@/lib/api-utils";
import { modelPaginate } from "@/lib/db";
import { requireStaff, withMiddleware } from "@/lib/middlewares";
import { CategoryValidator } from "@/lib/models/Category";

export const GET = withMiddleware(async (req, ctx) => {
  if (!ctx.models?.Category) {
    throw Errors.InternalServerError("Category model not found");
  }

  const result = await modelPaginate(ctx.models?.Category, {
    page: Number(req.nextUrl.searchParams.get("page")) || 1,
    pageSize: Number(req.nextUrl.searchParams.get("pageSize")) || 10,
    where: {
      name: {
        $regex:
          req.nextUrl.searchParams.get("query") ||
          req.nextUrl.searchParams.get("q") ||
          "",
        $options: "i",
      },
    },
  });
  return Responses.Success(result);
});

export const POST = withMiddleware(async (req, ctx) => {
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

  const category = new ctx.models.Category(isSafe.data);

  await category.save();

  return Responses.Created(category);
});
