import { Search } from "lucide-react";
import type { ReactNode } from "react";
import type { Article, ArticleStatus, Taxonomy } from "./editor.types.js";

export type StatusFilter = "all" | ArticleStatus;
export type KindFilter = "all" | Article["kind"];

export function BlogFilters({
  categoryId,
  kind,
  records,
  search,
  status,
  taxonomy,
  onCategoryChange,
  onKindChange,
  onSearchChange,
  onStatusChange,
}: {
  categoryId: number | null;
  kind: KindFilter;
  records: Article[];
  search: string;
  status: StatusFilter;
  taxonomy: Taxonomy[];
  onCategoryChange: (value: number | null) => void;
  onKindChange: (value: KindFilter) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
}) {
  const categories = taxonomy.filter((item) => item.kind === "category");
  return (
    <aside className="blogs-filter-rail" aria-label="Filter articles">
      <label className="blogs-search-filter">
        <Search aria-hidden="true" />
        <span className="sr-only">Search articles</span>
        <input
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search articles"
          type="search"
          value={search}
        />
      </label>
      <FilterGroup label="Status">
        {(["all", "published", "draft", "suspended", "archived"] as const).map(
          (value) => (
            <FilterRailButton
              active={status === value}
              count={countByStatus(records, value)}
              key={value}
              label={value === "all" ? "All content" : capitalize(value)}
              onClick={() => onStatusChange(value)}
            />
          ),
        )}
      </FilterGroup>
      <FilterGroup label="Type">
        {(["all", "post", "page"] as const).map((value) => (
          <FilterRailButton
            active={kind === value}
            count={countByKind(records, value)}
            key={value}
            label={value === "all" ? "Posts & pages" : `${capitalize(value)}s`}
            onClick={() => onKindChange(value)}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Categories">
        <FilterRailButton
          active={categoryId === null}
          count={records.length}
          label="All categories"
          onClick={() => onCategoryChange(null)}
        />
        {categories.map((category) => (
          <FilterRailButton
            active={categoryId === category.id}
            count={
              records.filter((record) => record.categoryId === category.id)
                .length
            }
            key={category.id}
            label={category.name}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </FilterGroup>
    </aside>
  );
}

export function BlogStats({ records }: { records: Article[] }) {
  const totalViews = records.reduce(
    (total, record) => total + record.viewCount,
    0,
  );
  const totalComments = records.reduce(
    (total, record) => total + record.commentCount,
    0,
  );
  const totalFavorites = records.reduce(
    (total, record) => total + record.favoriteCount,
    0,
  );
  const mostViewed = [...records].sort(
    (left, right) => right.viewCount - left.viewCount,
  )[0];
  return (
    <aside className="blogs-stats-rail" aria-label="Blog statistics">
      <section>
        <span>Overview</span>
        <h2>Blog statistics</h2>
        <div className="blogs-stats-grid">
          <Stat label="Articles" value={records.length} />
          <Stat label="Published" value={countByStatus(records, "published")} />
          <Stat label="Views" value={totalViews} />
          <Stat label="Comments" value={totalComments} />
          <Stat label="Favourites" value={totalFavorites} />
          <Stat label="Drafts" value={countByStatus(records, "draft")} />
        </div>
      </section>
      <section className="blogs-most-viewed">
        <span>Most viewed</span>
        {mostViewed ? (
          <>
            <strong>{mostViewed.title}</strong>
            <small>{mostViewed.viewCount} views</small>
          </>
        ) : (
          <small>No viewing activity yet.</small>
        )}
      </section>
    </aside>
  );
}

export function filterArticles(
  records: Article[],
  filter: {
    categoryId: number | null;
    kind: KindFilter;
    search: string;
    status: StatusFilter;
  },
) {
  const phrase = filter.search.trim().toLocaleLowerCase();
  return records.filter(
    (record) =>
      (filter.status === "all" || record.status === filter.status) &&
      (filter.kind === "all" || record.kind === filter.kind) &&
      (filter.categoryId === null || record.categoryId === filter.categoryId) &&
      (!phrase ||
        `${record.title} ${record.slug} ${record.authorName}`
          .toLocaleLowerCase()
          .includes(phrase)),
  );
}

export function filterTitle(status: StatusFilter, kind: KindFilter) {
  const type = kind === "all" ? "content" : `${kind}s`;
  return status === "all" ? `All ${type}` : `${capitalize(status)} ${type}`;
}

function FilterGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <section>
      <h2>{label}</h2>
      {children}
    </section>
  );
}

function FilterRailButton({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={active ? "is-active" : undefined}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <strong>{count}</strong>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <strong>{value.toLocaleString("en-IN")}</strong>
      <span>{label}</span>
    </div>
  );
}

function countByStatus(records: Article[], status: StatusFilter) {
  return status === "all"
    ? records.length
    : records.filter((record) => record.status === status).length;
}

function countByKind(records: Article[], kind: KindFilter) {
  return kind === "all"
    ? records.length
    : records.filter((record) => record.kind === kind).length;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
