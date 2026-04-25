import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../../shared/types/article';

const BOOKMARK_STORAGE_KEY = 'news_feed_app:bookmarks';

export interface BookmarkSnapshot {
  ids: number[];
  entities: Record<number, Article>;
}

const emptySnapshot: BookmarkSnapshot = {
  ids: [],
  entities: {},
};

export const loadBookmarks = async (): Promise<BookmarkSnapshot> => {
  const raw = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);

  if (!raw) {
    return emptySnapshot;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'number')) {
      return { ids: parsed, entities: {} };
    }

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      Array.isArray((parsed as BookmarkSnapshot).ids) &&
      typeof (parsed as BookmarkSnapshot).entities === 'object'
    ) {
      return parsed as BookmarkSnapshot;
    }

    return emptySnapshot;
  } catch {
    return emptySnapshot;
  }
};

export const saveBookmarks = async (snapshot: BookmarkSnapshot): Promise<void> => {
  await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(snapshot));
};
