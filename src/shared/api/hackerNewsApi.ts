import { Article } from '../types/article';
import { toArticle } from '../utils/articleFormatters';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const TOP_STORIES_LIMIT = 20;

const fetchJson = async <T,>(endpoint: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
};

export const fetchTopStories = async (): Promise<Article[]> => {
  const storyIds = await fetchJson<number[]>('/topstories.json');
  const topIds = storyIds.slice(0, TOP_STORIES_LIMIT);

  const items = await Promise.all(
    topIds.map(id => fetchJson(`/item/${id}.json`)),
  );

  return items
    .map(item => toArticle(item))
    .filter((item): item is Article => item !== null);
};
