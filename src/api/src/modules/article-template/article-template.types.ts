export type ArticleTemplateRecord = {
  id: number;
  uuid: string;
  name: string;
  kind: "post" | "page";
  excerpt: string;
  content: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
};
