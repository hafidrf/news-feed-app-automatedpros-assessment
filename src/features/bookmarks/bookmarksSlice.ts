import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../../shared/types/article';

interface BookmarksState {
  ids: number[];
  entities: Record<number, Article>;
}

const initialState: BookmarksState = {
  ids: [],
  entities: {},
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    hydrateBookmarks(
      state,
      action: PayloadAction<{ ids: number[]; entities: Record<number, Article> }>,
    ) {
      state.ids = action.payload.ids;
      state.entities = action.payload.entities;
    },
    toggleBookmark(state, action: PayloadAction<Article>) {
      const article = action.payload;
      const id = article.id;
      const exists = state.ids.includes(id);

      if (exists) {
        state.ids = state.ids.filter(bookmarkId => bookmarkId !== id);
        delete state.entities[id];
      } else {
        state.ids.push(id);
        state.entities[id] = article;
      }
    },
    removeBookmark(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.ids = state.ids.filter(bookmarkId => bookmarkId !== id);
      delete state.entities[id];
    },
  },
});

export const { hydrateBookmarks, toggleBookmark, removeBookmark } = bookmarksSlice.actions;
export const bookmarksReducer = bookmarksSlice.reducer;
