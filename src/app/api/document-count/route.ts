import { Responses } from "@/lib/api-utils";
import { AvailableModels, withMiddleware } from "@/lib/middlewares";

export const GET = withMiddleware(async (req, ctx) => {
  const searchParams = req.nextUrl.searchParams;
  const models = searchParams.get("models");

  const result = await Promise.all(
    models
      ?.split(",")
      .map((model) =>
        ctx.models?.[model as AvailableModels]?.countDocuments()
      ) || []
  );

  // @ts-ignore
  const total = result.reduce((sum, count) => sum + count, 0);

  return Responses.Success({
    total,
    models: models?.split(",").map((model) => ({
      name: model,
      count: result[models?.split(",").indexOf(model) || 0],
    })),
  });
});
