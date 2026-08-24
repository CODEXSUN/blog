import { useQuery } from "@tanstack/react-query";
import {
  listArticles,
  listArticleTemplates,
  listTaxonomy,
} from "./editor.services";
export const articleKey = ["blogs", "articles"] as const;
export const useArticles = () =>
  useQuery({ queryKey: articleKey, queryFn: listArticles });
export const useTaxonomy = () =>
  useQuery({ queryKey: ["blogs", "taxonomy"], queryFn: listTaxonomy });
export const useArticleTemplates = () =>
  useQuery({
    queryKey: ["blogs", "article-templates"],
    queryFn: listArticleTemplates,
  });
