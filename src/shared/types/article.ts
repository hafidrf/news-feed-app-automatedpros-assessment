export interface HackerNewsItemResponse {
  id: number;
  title?: string;
  url?: string;
  by?: string;
  score?: number;
  time?: number;
  type?: string;
}

export interface Article {
  id: number;
  title: string;
  url: string;
  author: string;
  score: number;
  time: number;
  domain: string;
  faviconUrl: string;
}

export type ArticleSortKey = 'score' | 'time';
