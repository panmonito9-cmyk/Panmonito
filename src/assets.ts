/** URLs for files in public/, including deployment under a subdirectory. */
export function assetUrl(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\.?\//, '');
}
