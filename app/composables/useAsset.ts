export function useAsset() {
  const base = useRuntimeConfig().app.baseURL;
  return (path: string) => `${base}${path.replace(/^\//, '')}`;
}
