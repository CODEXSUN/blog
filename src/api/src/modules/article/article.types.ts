export type ArticleStatus = "draft" | "published" | "suspended" | "archived";
export type ArticleRecord = {
  id: number;
  uuid: string;
  kind: "post" | "page";
  title: string;
  slug: string;
  excerpt: string;
  mdx: string;
  featuredImage: string;
  imageAlt: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorUserUuid: string | null;
  displayPosition: number;
  commentCount: number;
  viewCount: number;
  favoriteCount: number;
  categoryId: number | null;
  tagIds: number[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
export type ArticleSaveInput = Omit<
  ArticleRecord,
  | "id"
  | "uuid"
  | "commentCount"
  | "viewCount"
  | "favoriteCount"
  | "publishedAt"
  | "createdAt"
  | "updatedAt"
>;
