export type ArticleStatus = "draft" | "published" | "suspended" | "archived";
export type Article = {
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
export type ArticlePayload = Omit<
  Article,
  | "id"
  | "uuid"
  | "commentCount"
  | "viewCount"
  | "favoriteCount"
  | "publishedAt"
  | "createdAt"
  | "updatedAt"
>;
export type Taxonomy = {
  id: number;
  uuid: string;
  kind: "category" | "tag";
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};
export type ArticleTemplate = {
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
export type BlogAuthorOption = {
  email: string;
  name: string;
  status: string;
  uuid: string;
};
export type BlogMediaFile = {
  mimeType: string;
  name: string;
  url: string;
  uuid: string;
};
export type BlogsEditorHost = {
  listAuthors: (search: string) => Promise<BlogAuthorOption[]>;
  listImages: () => Promise<BlogMediaFile[]>;
  uploadImage: (file: File) => Promise<BlogMediaFile>;
};
