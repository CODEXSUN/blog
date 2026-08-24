import { defineBlogModule } from "../../runtime/blog-module.js";
import { registerArticleTemplateRoutes } from "./article-template.routes.js";

export const articleTemplateModule = defineBlogModule({
  key: "blogs.article-template",
  label: "Blog article templates",
  register: registerArticleTemplateRoutes,
});
