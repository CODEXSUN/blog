import { BlogError } from "../../runtime/blog-error.js";
import { DiscussionRepository } from "./discussion.repository.js";
import type { DiscussionSaveInput } from "./discussion.types.js";
export class DiscussionService {
  constructor(private readonly repository = new DiscussionRepository()) {}
  list(articleId?: number, publicOnly = false) {
    return this.repository.list(articleId, publicOnly);
  }
  async create(input: DiscussionSaveInput) {
    const value = {
      ...input,
      authorName: input.authorName.trim(),
      authorEmail: input.authorEmail.trim().toLowerCase(),
      body: input.body.trim(),
      rating: input.kind === "review" ? input.rating : null
    };
    if (!value.authorName || !value.authorEmail || !value.body)
      throw BlogError.validation("Name, email, and content are required.");
    if (value.kind === "review" && (!value.rating || value.rating < 1 || value.rating > 5))
      throw BlogError.validation("Reviews require a rating from 1 to 5.");
    if (!(await this.repository.articlePublished(value.articleId)))
      throw BlogError.notFound("Published article was not found.");
    if (value.parentId) {
      const parent = await this.repository.find(value.parentId);
      if (!parent || parent.articleId !== value.articleId)
        throw BlogError.validation("Reply parent must belong to the same article.");
    }
    return this.repository.create(value);
  }
  moderate(id: number, status: "approved" | "rejected") {
    return this.repository.moderate(id, status);
  }
}
