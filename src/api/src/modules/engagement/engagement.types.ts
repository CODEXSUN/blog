export type EngagementKind = "like" | "star" | "share" | "view" | "favorite";
export type EngagementSummary = {
  articleId: number;
  likes: number;
  stars: number;
  shares: number;
  views: number;
  favorites: number;
  averageStar: number;
};
export type FavoriteInput = {
  articleId: number;
  actorKey: string;
  active: boolean;
};
export type EngagementInput = {
  articleId: number;
  kind: EngagementKind;
  actorKey: string;
  rating: number | null;
  channel: string;
};
