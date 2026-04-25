import { Article, HackerNewsItemResponse } from '../types/article';

const FALLBACK_DOMAIN = 'news.ycombinator.com';

export const getDomainFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return FALLBACK_DOMAIN;
  }
};

export const toArticle = (
  item: HackerNewsItemResponse,
): Article | null => {
  if (item.type !== 'story' || !item.url || !item.title) {
    return null;
  }

  const domain = getDomainFromUrl(item.url);

  return {
    id: item.id,
    title: item.title,
    url: item.url,
    author: item.by ?? 'unknown',
    score: item.score ?? 0,
    time: item.time ?? 0,
    domain,
    faviconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  };
};

export const getRelativeTime = (unixTimeSeconds: number): string => {
  const now = Date.now();
  const inputMs = unixTimeSeconds * 1000;
  const deltaSeconds = Math.max(0, Math.floor((now - inputMs) / 1000));

  if (deltaSeconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(deltaSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const sortArticles = (
  articles: Article[],
  sortKey: 'score' | 'time',
): Article[] => {
  return [...articles].sort((a, b) => b[sortKey] - a[sortKey]);
};
