import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "./db";
import { Errors, HttpError } from "./api-utils";
import { initStripe } from "./stripe";
import Stripe from "stripe";

export const withErrorHandler = (handler: ApiHandler) => {
  return async (
    request: NextRequest,
    context: { params: Record<string, unknown> }
  ) => {
    try {
      const response = await handler(request, context);

      // Only process successful responses (2xx status codes)
      if (response.status >= 200 && response.status < 300) {
        try {
          const data = await response.clone().json();
          // catch me all for redundant keys in responses
          if (!!data.data && !!data.meta) {
            return NextResponse.json(
              { data: data.data, meta: data.meta, success: true },
              { status: response.status, headers: response.headers }
            );
          }
          return NextResponse.json(
            { data, success: true },
            { status: response.status, headers: response.headers }
          );
        } catch (e) {
          // If response is not JSON, return as is
          return response;
        }
      }
      return response;
    } catch (error) {
      console.error("Error in withErrorHandler middleware:", error);
      if (error instanceof HttpError) {
        return error.toResponse();
      }

      return NextResponse.json(
        {
          success: false,
          error: "Internal server error",
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        },
        { status: 500 }
      );
    }
  };
};

// Define available model names
export const AvailableModels = ["Product", "Category"] as const;
export type AvailableModels = (typeof AvailableModels)[number];

// Type for the model dictionary
type ModelDictionary = {
  [K in AvailableModels]: mongoose.Model<any>;
};

interface ApiHandlerContext<
  TParams extends Record<string, unknown> = Record<string, unknown>
> {
  params: TParams;
}

type ApiHandler<
  TParams extends Record<string, unknown> = Record<string, unknown>
> = (
  request: NextRequest,
  context: ApiHandlerContext<TParams>
) => Promise<Response>;

type ApiHandlerWithModels<
  TParams extends Record<string, unknown> = Record<string, unknown>
> = (
  request: NextRequest,
  context: ApiHandlerContext<TParams> & { models: ModelDictionary }
) => Promise<Response> | Promise<NextResponse> | NextResponse | Response;

type ApiHandlerWithStripe<
  TParams extends Record<string, unknown> = Record<string, unknown>
> = (
  request: NextRequest,
  context: ApiHandlerContext<TParams> & { stripe: Stripe }
) => Promise<Response> | Promise<NextResponse> | NextResponse | Response;

type ApiHandlerWithStripeAndModels<
  TParams extends Record<string, unknown> = Record<string, unknown>
> = (
  request: NextRequest,
  context: ApiHandlerContext<TParams> & {
    stripe?: Stripe;
    models?: ModelDictionary;
  }
) => Promise<Response> | Promise<NextResponse> | NextResponse | Response;

/**
 * Middleware that injects models into the API route handler
 * @param handler The API route handler function
 * @returns Next.js 13+ App Router API route handler with models injected
 */
// Import models to ensure they're registered with Mongoose
import Product from "./models/Product";
import Category from "./models/Category";
import { getAuth } from "@clerk/nextjs/server";
import { CLERK_STAFF_ORG_ID } from "./constants";

export const withModel = <
  TParams extends Record<string, unknown> = Record<string, unknown>
>(
  handler: ApiHandlerWithModels<TParams>
): ApiHandler<TParams> => {
  return async (request: NextRequest, context: ApiHandlerContext<TParams>) => {
    await dbConnect();

    // Initialize models dictionary with proper typing
    const models: ModelDictionary = {
      Product,
      Category,
    };

    // Add models to the context and call the handler
    return handler(request, {
      ...context,
      models,
    });
  };
};

export const withStripe = <
  TParams extends Record<string, unknown> = Record<string, unknown>
>(
  handler: ApiHandlerWithStripe<TParams>
): ApiHandler<TParams> => {
  return async (request: NextRequest, context: ApiHandlerContext<TParams>) => {
    return handler(request, {
      ...context,
      stripe: initStripe(),
    });
  };
};

export const withModelsAndStripe = <
  TParams extends Record<string, unknown> = Record<string, unknown>
>(
  handler: ApiHandlerWithStripeAndModels<TParams>
): ApiHandler<TParams> => {
  return async (request: NextRequest, context: ApiHandlerContext<TParams>) => {
    await dbConnect();

    // Initialize models dictionary with proper typing
    const models: ModelDictionary = {
      Product,
      Category,
    };

    // Add models to the context and call the handler
    return handler(request, {
      ...context,
      stripe: initStripe(),
      models,
    });
  };
};

/**
 * Composes multiple middlewares into a single middleware
 * @param handler The handler function to wrap
 * @param middlewares Array of middleware functions to apply
 * @returns A single middleware function that applies all middlewares
 */
type Middleware<
  TParams extends Record<string, unknown> = Record<string, unknown>
> = (handler: ApiHandler<TParams>) => ApiHandler<TParams>;

export const applyMiddlewares = <
  TParams extends Record<string, unknown> = Record<string, unknown>
>(
  handler: ApiHandlerWithModels<TParams>,
  ...middlewares: Middleware<TParams>[]
): ApiHandler<TParams> => {
  return middlewares.reduceRight<ApiHandler<TParams>>(
    (acc, middleware) => middleware(acc),
    handler as unknown as ApiHandler<TParams>
  );
};

/**
 * Combined middleware that applies both error handling and model injection
 * @param handler The API route handler function with models
 * @returns Next.js 13+ App Router API route handler with error handling and models injected
 */
// Helper function to maintain type safety with error handler
const wrapWithErrorHandler = <TParams extends Record<string, unknown>>(
  handler: ApiHandler<TParams>
): ApiHandler<TParams> => {
  return withErrorHandler(
    handler as ApiHandler<Record<string, unknown>>
  ) as ApiHandler<TParams>;
};

export const withMiddleware = <
  TParams extends Record<string, unknown> = Record<string, unknown>
>(
  handler: ApiHandlerWithStripeAndModels<TParams>
): ApiHandler<TParams> => {
  // Apply middlewares in reverse order
  const withModelMiddleware = withModelsAndStripe<TParams>(handler);

  return wrapWithErrorHandler<TParams>(withModelMiddleware);
};

export const requireStaff = (request: NextRequest) => {
  const { orgId } = getAuth(request);

  if (!orgId) {
    throw Errors.Unauthorized("Unauthorized");
  }

  if (orgId !== CLERK_STAFF_ORG_ID) {
    throw Errors.Unauthorized("Unauthorized");
  }

  return true;
};
