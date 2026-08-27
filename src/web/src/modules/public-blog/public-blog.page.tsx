import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu, Search, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import {
  getFavoriteArticleIds,
  getPublicTaxonomy,
  searchPublicArticles,
  setFavorite,
} from "./public-blog.services.js";
import {
  formatRelativeTime,
  PublicStoryShowcase,
  StoryRow,
} from "./public-blog.stories.js";
import type { PublicArticle, PublicTaxonomy } from "./public-blog.types.js";
import { blogVisitorKey } from "./visitor.js";
import "./public-blog.css";

type BlogFilter =
  | "all"
  | "latest"
  | "popular"
  | "favorites"
  | `category:${number}`
  | `tag:${number}`;

export function PublicBlogPage({
  mediaBasePath = "/storage/public/blogs/images",
}: {
  mediaBasePath?: string;
} = {}) {
  const client = useQueryClient();
  const [filter, setFilter] = useState<BlogFilter>("all");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const actorKey = useMemo(blogVisitorKey, []);
  const articlesQuery = useQuery({
    queryFn: () => searchPublicArticles(),
    queryKey: ["public-blog"],
  });
  const taxonomyQuery = useQuery({
    queryFn: getPublicTaxonomy,
    queryKey: ["public-blog-taxonomy"],
  });
  const favoritesQuery = useQuery({
    queryFn: () => getFavoriteArticleIds(actorKey),
    queryKey: ["public-blog-favorites", actorKey],
  });
  const favoriteIds = favoritesQuery.data ?? [];
  const favorite = useMutation({
    mutationFn: setFavorite,
    onSuccess: (_summary, variables) => {
      client.setQueryData<number[]>(
        ["public-blog-favorites", actorKey],
        (current = []) =>
          variables.active
            ? [...new Set([...current, variables.articleId])]
            : current.filter((id) => id !== variables.articleId),
      );
      void client.invalidateQueries({ queryKey: ["public-blog"] });
    },
  });
  const taxonomy = taxonomyQuery.data ?? [];
  const categories = taxonomy.filter((item) => item.kind === "category");
  const tags = taxonomy.filter((item) => item.kind === "tag");
  const taxonomyById = new Map(taxonomy.map((item) => [item.id, item]));
  const articles = useMemo(
    () =>
      filterArticles(
        articlesQuery.data ?? [],
        filter,
        search,
        new Set(favoriteIds),
      ),
    [articlesQuery.data, favoriteIds, filter, search],
  );
  const showShowcase = filter === "all" && !search.trim();
  const showcaseArticles = showShowcase
    ? (articlesQuery.data ?? []).slice(0, 7)
    : [];
  const listedArticles = showShowcase ? articles.slice(7) : articles;

  return (
    <div className="public-blog">
      {!articlesQuery.isLoading && !articlesQuery.isError ? (
        <PublicStoryShowcase
          articles={showcaseArticles}
          mediaBasePath={mediaBasePath}
          taxonomy={taxonomyById}
        />
      ) : null}

      <div
        className={`public-blog-layout${drawerOpen ? " is-drawer-open" : ""}`}
      >
        <main className="public-blog-results">
          <header className="public-blog-toolbar">
            <div className="public-blog-heading">
              <span>Showing</span>
              <h2>{filterLabel(filter, taxonomyById)}</h2>
            </div>
            <div className="public-blog-top-filters" aria-label="Story filters">
              {(["all", "latest", "popular", "favorites"] as const).map(
                (value) => (
                  <FilterButton
                    active={filter === value}
                    key={value}
                    onClick={() => setFilter(value)}
                  >
                    {topFilterLabel(value)}
                  </FilterButton>
                ),
              )}
            </div>
            <label className="public-blog-search">
              <Search aria-hidden="true" />
              <span className="sr-only">Search stories</span>
              <input
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search stories"
                type="search"
                value={search}
              />
            </label>
            <button
              aria-expanded={drawerOpen}
              aria-label={
                drawerOpen ? "Hide story filters" : "Show story filters"
              }
              className="public-blog-drawer-toggle"
              onClick={() => setDrawerOpen((open) => !open)}
              type="button"
            >
              {drawerOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
              <span>Filters</span>
            </button>
          </header>

          <section className="public-blog-feed" aria-live="polite">
            {articlesQuery.isLoading ? (
              <p className="public-blog-state">Loading stories…</p>
            ) : null}
            {articlesQuery.isError ? (
              <p className="public-blog-state">
                Stories are temporarily unavailable.
              </p>
            ) : null}
            {!articlesQuery.isLoading &&
            !articlesQuery.isError &&
            !listedArticles.length ? (
              <p className="public-blog-state">
                {showShowcase
                  ? "More stories are coming soon."
                  : filter === "favorites"
                    ? "Save a story and it will appear here."
                    : "No stories match this selection."}
              </p>
            ) : null}
            {listedArticles.map((article) => (
              <StoryRow
                article={article}
                category={
                  article.categoryId
                    ? taxonomyById.get(article.categoryId)
                    : undefined
                }
                favorite={favoriteIds.includes(article.id)}
                key={article.id}
                mediaBasePath={mediaBasePath}
                onFavorite={() =>
                  favorite.mutate({
                    articleId: article.id,
                    actorKey,
                    active: !favoriteIds.includes(article.id),
                  })
                }
              />
            ))}
          </section>
        </main>

        {drawerOpen ? (
          <aside
            className="public-blog-sidebar"
            aria-label="Filter blog stories"
          >
            <BlogFilterGroup title="Categories">
              {categories.map((category) => (
                <FilterButton
                  active={filter === `category:${category.id}`}
                  key={category.id}
                  onClick={() => setFilter(`category:${category.id}`)}
                >
                  {category.name}
                </FilterButton>
              ))}
            </BlogFilterGroup>

            <BlogFilterGroup title="Tags">
              <div className="public-blog-tags">
                {tags.map((tag) => (
                  <button
                    aria-pressed={filter === `tag:${tag.id}`}
                    className={
                      filter === `tag:${tag.id}` ? "is-active" : undefined
                    }
                    key={tag.id}
                    onClick={() => setFilter(`tag:${tag.id}`)}
                    type="button"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </BlogFilterGroup>

            <BlogFilterGroup title="Recent">
              <ol className="public-blog-recent">
                {articlesQuery.data?.slice(0, 5).map((article) => (
                  <li key={article.id}>
                    <a href={`/blog/${article.slug}`}>{article.title}</a>
                    <span>{formatRelativeTime(article.publishedAt)}</span>
                  </li>
                ))}
              </ol>
            </BlogFilterGroup>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function BlogFilterGroup({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={active ? "is-active" : undefined}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function filterArticles(
  articles: PublicArticle[],
  filter: BlogFilter,
  search: string,
  favoriteIds: Set<number>,
) {
  const phrase = search.trim().toLocaleLowerCase();
  const result = phrase
    ? articles.filter((article) =>
        `${article.title} ${article.excerpt} ${article.authorName}`
          .toLocaleLowerCase()
          .includes(phrase),
      )
    : [...articles];
  if (filter === "latest") return result.slice(0, 6);
  if (filter === "popular")
    return result.sort(
      (left, right) =>
        popularity(right) - popularity(left) ||
        Date.parse(right.publishedAt ?? right.createdAt) -
          Date.parse(left.publishedAt ?? left.createdAt),
    );
  if (filter === "favorites")
    return result.filter((article) => favoriteIds.has(article.id));
  if (filter === "all") return result;
  const [kind, rawId] = filter.split(":") as ["category" | "tag", string];
  const id = Number(rawId);
  return result.filter((article) =>
    kind === "category"
      ? article.categoryId === id
      : article.tagIds.includes(id),
  );
}

function popularity(article: PublicArticle) {
  return (
    article.viewCount + article.commentCount * 4 + article.favoriteCount * 3
  );
}

function filterLabel(
  filter: BlogFilter,
  taxonomy: Map<number, PublicTaxonomy>,
) {
  if (filter === "all") return "All stories";
  if (filter === "latest") return "Latest stories";
  if (filter === "popular") return "Popular stories";
  if (filter === "favorites") return "Your favourites";
  const id = Number(filter.split(":")[1]);
  return taxonomy.get(id)?.name ?? "Selected stories";
}

function topFilterLabel(filter: "all" | "latest" | "popular" | "favorites") {
  return {
    all: "All stories",
    latest: "Latest",
    popular: "Popular",
    favorites: "Favourites",
  }[filter];
}
