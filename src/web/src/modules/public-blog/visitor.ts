export function blogVisitorKey() {
  const storageKey = "codexsun.blog.visitor";
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;
  const visitor = crypto.randomUUID();
  localStorage.setItem(storageKey, visitor);
  return visitor;
}
