export type Bookmark = {
  url: string;
  slug: string;
};

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  return /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function parseBookmarks(value: string | null): Bookmark[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isBookmark);
  } catch {
    return [];
  }
}

export function formatBookmark(bookmark: Bookmark): string {
  return `${bookmark.url} :: ${bookmark.slug}`;
}

export function generateSlug(seed = Date.now()): string {
  let number = Math.max(0, Math.floor(seed));
  let encoded = '';

  do {
    encoded = `${BASE62[number % BASE62.length]}${encoded}`;
    number = Math.floor(number / BASE62.length);
  } while (number > 0);

  return `mona-${encoded.padStart(4, '0')}`;
}

export function createUniqueSlug(bookmarks: Bookmark[]): string {
  const existing = new Set(bookmarks.map((bookmark) => bookmark.slug));
  let seed = Date.now();
  let slug = generateSlug(seed);

  while (existing.has(slug)) {
    seed += 1;
    slug = generateSlug(seed);
  }

  return slug;
}

function isBookmark(value: unknown): value is Bookmark {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.url === 'string' &&
    candidate.url.trim().length > 0 &&
    typeof candidate.slug === 'string' &&
    /^mona-[0-9A-Za-z]+$/.test(candidate.slug)
  );
}
