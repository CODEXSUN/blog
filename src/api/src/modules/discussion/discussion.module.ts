import { defineBlogModule } from "../../runtime/blog-module.js";
import { registerDiscussionRoutes } from "./discussion.routes.js";
export const discussionModule = defineBlogModule({
  key: "blogs.discussion",
  label: "Blog discussions",
  register: registerDiscussionRoutes
});
