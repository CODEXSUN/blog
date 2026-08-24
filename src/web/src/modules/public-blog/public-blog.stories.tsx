import { ArrowRight, Bookmark, Eye, MessageCircle } from "lucide-react";
import { blogMediaUrl, blogPlaceholder } from "./media";
import type { PublicArticle, PublicTaxonomy } from "./public-blog.types";

export function PublicStoryShowcase({
  articles,
  mediaBasePath,
  taxonomy,
}: {
  articles: PublicArticle[];
  mediaBasePath: string;
  taxonomy: Map<number, PublicTaxonomy>;
}) {
  const [single, ...rest] = articles;
  const pair = rest.slice(0, 2);
  const four = rest.slice(2, 6);
  if (!single) return null;

  return (
    <section className="public-blog-showcase" aria-label="Featured stories">
      <section className="public-blog-feature-block is-leading">
        <ShowcaseHeading eyebrow="Featured" title="One story worth your time" />
        <ShowcaseCard
          article={single}
          category={categoryName(single, taxonomy)}
          mediaBasePath={mediaBasePath}
          variant="single"
        />
      </section>
      {pair.length ? (
        <section className="public-blog-feature-block">
          <ShowcaseHeading
            eyebrow="In focus"
            title="Two practical perspectives"
          />
          <div className="public-blog-card-pair">
            {pair.map((article) => (
              <ShowcaseCard
                article={article}
                category={categoryName(article, taxonomy)}
                key={article.id}
                mediaBasePath={mediaBasePath}
                variant="pair"
              />
            ))}
          </div>
        </section>
      ) : null}
      {four.length ? (
        <section className="public-blog-feature-block">
          <ShowcaseHeading eyebrow="Explore" title="More from the journal" />
          <div className="public-blog-card-four">
            {four.map((article) => (
              <ShowcaseCard
                article={article}
                category={categoryName(article, taxonomy)}
                key={article.id}
                mediaBasePath={mediaBasePath}
                variant="compact"
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}

export function StoryRow({
  article,
  category,
  favorite,
  mediaBasePath,
  onFavorite,
}: {
  article: PublicArticle;
  category: PublicTaxonomy | undefined;
  favorite: boolean;
  mediaBasePath: string;
  onFavorite: () => void;
}) {
  return (
    <article className="public-blog-story">
      <div className="public-blog-story-image">
        <StoryImage article={article} mediaBasePath={mediaBasePath} />
      </div>
      <div className="public-blog-story-copy">
        <strong>
          <a
            aria-label={`Read ${article.title}`}
            className="public-blog-story-link"
            href={`/blog/${article.slug}`}
          >
            {article.title}
          </a>
        </strong>
        <p>{article.excerpt}</p>
        <span>
          {article.authorName} · {formatRelativeTime(article.publishedAt)}
        </span>
      </div>
      <span className="public-blog-story-category">
        {category?.name ?? "Business"}
      </span>
      <div className="public-blog-story-metrics">
        <span title="Comments">
          <MessageCircle aria-hidden="true" /> {article.commentCount}
        </span>
        <span title="Views">
          <Eye aria-hidden="true" /> {article.viewCount}
        </span>
        <button
          aria-label={`${favorite ? "Remove" : "Add"} ${article.title} ${favorite ? "from" : "to"} favourites`}
          aria-pressed={favorite}
          className={favorite ? "is-favorite" : undefined}
          onClick={onFavorite}
          title={favorite ? "Remove from favourites" : "Add to favourites"}
          type="button"
        >
          <Bookmark
            aria-hidden="true"
            fill={favorite ? "currentColor" : "none"}
          />
          <span>{article.favoriteCount}</span>
        </button>
      </div>
    </article>
  );
}

export function formatRelativeTime(value: string | null) {
  if (!value) return "recently";
  const difference = new Date(value).getTime() - Date.now();
  const units = [
    ["year", 31_536_000_000],
    ["month", 2_592_000_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ] as const;
  const [unit, milliseconds] = units.find(
    ([, size]) => Math.abs(difference) >= size,
  ) ?? ["minute", 60_000];
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round(difference / milliseconds),
    unit,
  );
}

function ShowcaseCard({
  article,
  category,
  mediaBasePath,
  variant,
}: {
  article: PublicArticle;
  category: string;
  mediaBasePath: string;
  variant: "single" | "pair" | "compact";
}) {
  return (
    <article className={`public-blog-showcase-card is-${variant}`}>
      <div className="public-blog-showcase-image">
        <StoryImage article={article} mediaBasePath={mediaBasePath} />
      </div>
      <div className="public-blog-showcase-copy">
        <span>{category}</span>
        <h2>
          <a
            aria-label={`Read ${article.title}`}
            className="public-blog-card-link"
            href={`/blog/${article.slug}`}
          >
            {article.title}
          </a>
        </h2>
        <p>{article.excerpt}</p>
        {variant === "single" ? (
          <>
            <dl className="public-blog-feature-details">
              <div>
                <dt>Author</dt>
                <dd>{article.authorName}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatCreatedDate(article.createdAt)}</dd>
              </div>
            </dl>
            <span className="public-blog-read-more">
              Read more
              <ArrowRight aria-hidden="true" />
            </span>
          </>
        ) : (
          <small>
            {article.authorName} · {formatRelativeTime(article.publishedAt)}
          </small>
        )}
      </div>
    </article>
  );
}

function ShowcaseHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="public-blog-section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </header>
  );
}

function StoryImage({
  article,
  mediaBasePath,
}: {
  article: PublicArticle;
  mediaBasePath: string;
}) {
  const fallback = blogPlaceholder("");
  const source = article.featuredImage
    ? blogMediaUrl(article.featuredImage, mediaBasePath)
    : fallback;
  return (
    <img
      alt={article.imageAlt || ""}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallback;
      }}
      src={source}
    />
  );
}

function categoryName(
  article: PublicArticle,
  taxonomy: Map<number, PublicTaxonomy>,
) {
  return article.categoryId
    ? (taxonomy.get(article.categoryId)?.name ?? "Business")
    : "Business";
}

function formatCreatedDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
