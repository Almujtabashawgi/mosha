import type { Product } from '../types';

/* ----------------------------- Images ----------------------------- */

const MAX_INPUT_BYTES = 20 * 1024 * 1024; // reject anything over 20 MB before processing

/**
 * Resize + convert an image to WebP in the browser before upload.
 * Gives sharp, consistent pictures that load fast on phones.
 */
export async function optimizeImage(file: File, maxSide = 1920, quality = 0.86): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('not_image');
  if (file.size > MAX_INPUT_BYTES) throw new Error('too_large');
  // Keep animated GIFs as they are
  if (file.type === 'image/gif') return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  // Fall back to the original if WebP isn't supported or made it bigger
  if (!blob || (blob.size > file.size && scale === 1)) return file;
  return blob;
}

/** Random, URL-safe storage path — never trust the original file name. */
export function storagePath(folder: string, blob: Blob) {
  const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : blob.type === 'image/gif' ? 'gif' : 'jpg';
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${folder}/${id}.${ext}`;
}

/** Normalise the `images` column (array, comma string, or empty) + main image into a clean list. */
export function productImages(p: Pick<Product, 'image' | 'images'>): string[] {
  let list: string[] = [];
  if (Array.isArray(p.images)) list = p.images;
  else if (typeof p.images === 'string' && p.images.trim()) {
    const raw = p.images.trim();
    if (raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      } catch {
        /* ignore */
      }
    } else if (raw.startsWith('{') && raw.endsWith('}')) {
      list = raw.slice(1, -1).split(',').map((s) => s.replace(/^"|"$/g, ''));
    } else list = raw.split(',');
  }
  const all = [p.image ?? '', ...list].map((s) => String(s).trim()).filter((s) => /^https?:\/\//.test(s));
  return Array.from(new Set(all));
}

/* ----------------------------- YouTube ----------------------------- */

/** Extract a YouTube video id from watch, youtu.be, shorts, embed or live URLs. */
export function youtubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else {
        const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
        id = m?.[1] ?? null;
      }
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export const youtubeEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
