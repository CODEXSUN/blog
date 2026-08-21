import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { blogMediaUrl, blogPlaceholder } from "./media";
import {
  getPublicTaxonomy,
  searchPublicArticles,
} from "./public-blog.services";
import type { PublicArticle, PublicTaxonomy } from "./public-blog.types";
import "./public-blog.css";

type BlogFilter = "all" | "latest" | `category:${number}` | `tag:${number}`;

export function PublicBlogPage({
  mediaBasePath = "/storage/public/blogs/images",
}: {
  mediaBasePath?: string;
} = {}) {
  const [filter, setFilter] = useState<BlogFilter>("all");
  const articlesQuery = useQuery({
    queryFn: () => searchPublicArticles(),
    queryKey: ["public-blog"],
  });
  const taxonomyQuery = useQuery({
    queryFn: getPublicTaxonomy,
    queryKey: ["public-blog-taxonomy"],
  });
  const taxonomy = taxonomyQuery.data ?? [];
  const articles = useMemo(
    () => filterArticles(articlesQuery.data ?? [], filter),
    [articlesQuery.data, filter],
  );
  const categories = taxonomy.filter((item) => item.kind === "category");
  const tags = taxonomy.filter((item) => item.kind === "tag");
  const taxonomyById = new Map(taxonomy.map((item) => [item.id, item]));

  return (
    <div className="public-blog">
      <section className="public-blog-hero">
        <span>CODEXSUN field notes</span>
        <h1>Ideas that make the working day clearer.</h1>
        <p>
          Practical guidance for business operations, accounts, billing,
          manufacturing, and controlled automation.
        </p>
      </section>

      <div className="public-blog-layout">
        <aside className="public-blog-sidebar" aria-label="Filter blog stories">
          <BlogFilterGroup title="Browse">
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All stories
            </FilterButton>
            <FilterButton
              active={filter === "latest"}
              onClick={() => setFilter("latest")}
            >
              Latest six
            </FilterButton>
          </BlogFilterGroup>

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
                  <span>{formatDate(article.publishedAt)}</span>
                </li>
              ))}
            </ol>
          </BlogFilterGroup>
        </aside>

        <main className="public-blog-results">
          <header>
            <div>
              <span>Showing</span>
              <h2>{filterLabel(filter, taxonomyById)}</h2>
            </div>
            <strong>{articles.length} stories</strong>
          </header>

          <section className="public-blog-grid" aria-live="polite">
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
            !articles.length ? (
              <p className="public-blog-state">
                No stories match this selection.
              </p>
            ) : null}
            {articles.map((article, index) => (
              <StoryCard
                article={article}
                category={
                  article.categoryId
                    ? taxonomyById.get(article.categoryId)
                    : undefined
                }
                featured={index === 0}
                key={article.id}
                mediaBasePath={mediaBasePath}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}

function StoryCard({
  article,
  category,
  featured,
  mediaBasePath,
}: {
  article: PublicArticle;
  category: PublicTaxonomy | undefined;
  featured: boolean;
  mediaBasePath: string;
}) {
  return (
    <article className={featured ? "featured" : undefined}>
      {article.featuredImage ? (
        <img
          alt={article.imageAlt}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = blogPlaceholder(article.title);
          }}
          src={blogMediaUrl(article.featuredImage, mediaBasePath)}
        />
      ) : null}
      <div>
        <span>
          {category?.name ?? "Business"} · {formatDate(article.publishedAt)}
        </span>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <a href={`/blog/${article.slug}`}>
          Read story <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </article>
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

function filterArticles(articles: PublicArticle[], filter: BlogFilter) {
  if (filter === "all") return articles;
  if (filter === "latest") return articles.slice(0, 6);
  const [kind, rawId] = filter.split(":") as ["category" | "tag", string];
  const id = Number(rawId);
  return articles.filter((article) =>
    kind === "category"
      ? article.categoryId === id
      : article.tagIds.includes(id),
  );
}

function filterLabel(
  filter: BlogFilter,
  taxonomy: Map<number, PublicTaxonomy>,
) {
  if (filter === "all") return "All stories";
  if (filter === "latest") return "Latest stories";
  const id = Number(filter.split(":")[1]);
  return taxonomy.get(id)?.name ?? "Selected stories";
}

function formatDate(value: string | null) {
  if (!value) return "Recently published";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
