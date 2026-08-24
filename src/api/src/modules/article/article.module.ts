import { defineBlogModule } from "../../runtime/blog-module.js";
import { registerArticleRoutes } from "./article.routes.js";
export const articleModule = defineBlogModule({
  key: "blogs.article",
  label: "Blog articles",
  register: registerArticleRoutes
});
