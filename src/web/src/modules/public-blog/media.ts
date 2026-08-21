export function blogMediaUrl(
  value: string,
  basePath = "/storage/public/blogs/images",
) {
  const source = value.trim();
  if (!source) return "";
  if (/^(https?:|data:|blob:)/iu.test(source)) return source;
  if (source.startsWith("/storage/") || source.startsWith("http"))
    return source;
  if (source.startsWith("/blog/") || source.startsWith("/uploads/")) {
    return `${basePath.replace(/\/+$/u, "")}/${source.split("/").pop()}`;
  }
  if (source.startsWith("/")) return source;
  return `${basePath.replace(/\/+$/u, "")}/${source.replace(/^\/+/u, "")}`;
}

export function blogPlaceholder(label: string) {
  const text = label.replace(/[<>&"']/gu, "").slice(0, 64);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#e7e0d2"/><circle cx="980" cy="100" r="220" fill="#d5c6af"/><path d="M0 560C220 420 350 690 610 520s380-20 590 30v125H0z" fill="#b99768"/><text x="72" y="116" fill="#172033" font-family="Georgia,serif" font-size="42">${text}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
