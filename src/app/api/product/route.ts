import { Errors, Responses, ZodErrorFormatter } from "@/lib/api-utils";
import { modelPaginate } from "@/lib/db";
import { requireStaff, withMiddleware } from "@/lib/middlewares";
import { ProductValidator } from "@/lib/models/Product";

export const GET = withMiddleware(async (req, ctx) => {
  if (!ctx.models?.Product) {
    throw Errors.InternalServerError("Product model not found");
  }

  const params = req.nextUrl.searchParams;
  const populate = params.get("populate");

  const result = await modelPaginate(ctx.models?.Product, {
    page: Number(params.get("page")) || 1,
    pageSize: Number(params.get("pageSize")) || 10,
    where: {
      name: {
        $regex: params.get("query") || req.nextUrl.searchParams.get("q") || "",
        $options: "i",
      },
    },
    populates: populate ? populate.split(",") : [],
  });
  return Responses.Success(result);
});

export const POST = withMiddleware(async (req, ctx) => {
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

  const product = new ctx.models.Product(isSafe.data);

  if (!product) {
    throw Errors.InternalServerError("Failed to create product");
  }

  await product.save();

  return Responses.Created(product);
});
