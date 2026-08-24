import type { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { z } from "zod";
import { BlogError } from "./blog-error.js";

type AnySchema = z.ZodType<unknown>;
type RouteSchemas = {
  body?: AnySchema;
  params?: AnySchema;
  querystring?: AnySchema;
  response: AnySchema;
};

type RouteContext<TSchemas extends RouteSchemas> = {
  body: TSchemas["body"] extends z.ZodType<infer TBody> ? TBody : undefined;
  params: TSchemas["params"] extends z.ZodType<infer TParams> ? TParams : undefined;
  query: TSchemas["querystring"] extends z.ZodType<infer TQuery> ? TQuery : undefined;
  reply: FastifyReply;
  request: FastifyRequest;
};

export function registerBlogRoute<TSchemas extends RouteSchemas>(
  app: FastifyInstance,
  options: {
    handler: (
      context: RouteContext<TSchemas>,
    ) => Promise<z.output<TSchemas["response"]>> | z.output<TSchemas["response"]>;
    method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
    preHandler?: RouteOptions["preHandler"];
    schemas: TSchemas;
    url: string;
  },
) {
  app.route({
    method: options.method,
    url: options.url,
    ...(options.preHandler ? { preHandler: options.preHandler } : {}),
    handler: async (request, reply) => {
      const context = {
        body: parse(options.schemas.body, request.body, "body"),
        params: parse(options.schemas.params, request.params, "params"),
        query: parse(options.schemas.querystring, request.query, "querystring"),
        reply,
        request,
      } as RouteContext<TSchemas>;
      const data = parse(
        options.schemas.response,
        await options.handler(context),
        "response",
      );
      const requestContext = request as FastifyRequest & {
        correlationId?: string;
        tenantId?: string;
      };
      return {
        data,
        meta: {
          requestId: request.id,
          timestamp: new Date().toISOString(),
          ...(requestContext.correlationId
            ? { correlationId: requestContext.correlationId }
            : {}),
          ...(requestContext.tenantId ? { tenantId: requestContext.tenantId } : {}),
        },
        success: true as const,
      };
    },
  });
}

function parse<TSchema extends AnySchema | undefined>(
  schema: TSchema,
  value: unknown,
  location: string,
) {
  if (!schema) return undefined;
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  throw BlogError.validation(`Invalid request ${location}`, {
    issues: result.error.issues,
    location,
  });
}
