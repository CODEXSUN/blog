import type { FastifyInstance } from "fastify";

export type BlogModule = {
  key: string;
  label: string;
  register: (app: FastifyInstance) => Promise<void> | void;
};

export function defineBlogModule(module: BlogModule): BlogModule {
  return module;
}
