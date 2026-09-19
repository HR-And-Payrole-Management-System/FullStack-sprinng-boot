export function resolveUploadUrl(path) {
  if (!path) return null;
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  const serverOrigin = apiBase.replace(/\/api\/v1\/?$/, '');
  return `${serverOrigin}${path}`;
}