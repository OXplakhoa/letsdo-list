import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

interface HandlerOptions {
  bodySchema?: ZodSchema;
  querySchema?: ZodSchema;
}

interface ValidatedData {
  body?: unknown;
  query?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerFn = (
  req: NextRequest,
  context: any,
  validated: ValidatedData
) => Promise<NextResponse>;

/**
 * API handler wrapper that provides:
 * - Zod validation for request body (POST/PATCH) and query params (GET)
 * - Consistent error handling and error response format
 * - Try/catch wrapping for all handlers
 */
export function apiHandler(handler: HandlerFn, options?: HandlerOptions) {
  return async (
    req: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    try {
      let validatedBody: unknown;
      let validatedQuery: unknown;

      // Validate request body for POST/PATCH/PUT
      if (options?.bodySchema) {
        const body = await req.json();
        validatedBody = options.bodySchema.parse(body);
      }

      // Validate query params for GET requests
      // searchParams are always strings — schema should use z.coerce.number()
      // for page/limit so "2" -> 2 before validation
      if (options?.querySchema) {
        const params = Object.fromEntries(req.nextUrl.searchParams);
        validatedQuery = options.querySchema.parse(params);
      }

      return await handler(req, context, {
        body: validatedBody,
        query: validatedQuery,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            errors: error.issues.map((e) => ({
              message: e.message,
              path: e.path,
            })),
          },
          { status: 400 }
        );
      }

      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
