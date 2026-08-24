import { defineBlogModule } from "../../runtime/blog-module.js";
import { registerTaxonomyRoutes } from "./taxonomy.routes.js";
export const taxonomyModule = defineBlogModule({
  key: "blogs.taxonomy",
  label: "Blog taxonomy",
  register: registerTaxonomyRoutes
});
