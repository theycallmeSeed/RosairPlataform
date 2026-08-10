/**
 * Overrides the Unsplash `w`/`h`/`q` query params for the size an image is
 * actually rendered at, instead of always shipping the source crop baked
 * into the mock data. No-ops for any non-Unsplash URL (e.g. local upload
 * previews) so it's safe to wrap unconditionally.
 */
export function optimizedImageUrl(url: string, width: number, height: number, quality = 70): string {
  if (!url.includes("images.unsplash.com")) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(width));
    u.searchParams.set("h", String(height));
    u.searchParams.set("q", String(quality));
    u.searchParams.set("fit", "crop");
    return u.toString();
  } catch {
    return url;
  }
}
