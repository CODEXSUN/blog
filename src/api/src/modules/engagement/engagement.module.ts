import { defineBlogModule } from "../../runtime/blog-module.js";
import { registerEngagementRoutes } from "./engagement.routes.js";
export const engagementModule = defineBlogModule({
  key: "blogs.engagement",
  label: "Blog engagement",
  register: registerEngagementRoutes
});
