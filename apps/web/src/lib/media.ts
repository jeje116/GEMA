export interface NormalizedMedia {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface NormalizedVideo {
  src: string;
  poster?: string;
  mimeType?: string;
}

/**
 * Normalizes a Payload Media document or relation into a standard presentation object.
 * Seamlessly supports both local/relative filesystem paths (/api/media/file/...) and absolute URLs.
 * Payload CMS is the sole runtime source of truth; no static fallback paths are accepted.
 */
export function resolveMedia(
  media: any,
  context?: string
): NormalizedMedia {
  // A. null / undefined: legitimate optional CMS relations
  if (media === null || media === undefined) {
    return {
      src: '',
      alt: '',
    };
  }

  // B. Non-null malformed / unpopulated value (e.g. primitive ID, object without url)
  if (typeof media !== 'object' || !media.url) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[CMS Media Warning] Unpopulated or malformed Payload Media relation${context ? ` in ${context}` : ''}:`, media);
    }
    return {
      src: '',
      alt: typeof media?.alt === 'string' ? media.alt : (media?.alt?.en || media?.alt?.id || ''),
    };
  }

  let src = media.url || '';
  if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/')) {
    src = `/${src}`;
  }

  const alt = typeof media.alt === 'string' 
    ? media.alt 
    : (media.alt?.en || media.alt?.id || '');

  return {
    src,
    alt,
    width: media.width || undefined,
    height: media.height || undefined,
    mimeType: media.mimeType || undefined,
  };
}

export function resolveVideo(
  videoMedia: any,
  posterMedia: any,
  context?: string
): NormalizedVideo {
  const resolvedVideo = resolveMedia(videoMedia, context ? `${context} (videoFile)` : undefined);
  const resolvedPoster = resolveMedia(posterMedia, context ? `${context} (videoPoster)` : undefined);

  return {
    src: resolvedVideo.src,
    poster: resolvedPoster.src || undefined,
    mimeType: resolvedVideo.mimeType || 'video/mp4',
  };
}
