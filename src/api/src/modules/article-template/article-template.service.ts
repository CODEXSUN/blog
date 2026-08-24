import { ArticleTemplateRepository } from "./article-template.repository.js";

export class ArticleTemplateService {
  constructor(private readonly repository = new ArticleTemplateRepository()) {}
  list() {
    return this.repository.list();
  }
}
