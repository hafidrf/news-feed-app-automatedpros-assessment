import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

import { fetchTopStories } from '../../shared/api/hackerNewsApi';
import { Article, ArticleSortKey } from '../../shared/types/article';
import { sortArticles } from '../../shared/utils/articleFormatters';
import { RootState } from '../../app/store/store';

interface ArticlesState {
  items: Article[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  sortBy: ArticleSortKey;
}

const initialState: ArticlesState = {
  items: [],
  loading: false,
  refreshing: false,
  error: null,
  sortBy: 'score',
};

export const loadArticles = createAsyncThunk<Article[], { refresh?: boolean } | undefined>(
  'articles/loadArticles',
  async () => {
    return fetchTopStories();
  },
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setSortBy(state, action: { payload: ArticleSortKey }) {
      state.sortBy = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadArticles.pending, (state, action) => {
        const isRefresh = action.meta.arg?.refresh === true;
        state.error = null;
        state.refreshing = isRefresh;
        state.loading = !isRefresh;
      })
      .addCase(loadArticles.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.refreshing = false;
      })
      .addCase(loadArticles.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.error.message ?? 'Unable to load stories';
      });
  },
});

export const { setSortBy } = articlesSlice.actions;
export const articlesReducer = articlesSlice.reducer;

export const selectArticlesState = (state: RootState) => state.articles;
export const selectSortedArticles = createSelector(
  [selectArticlesState],
  articlesState => sortArticles(articlesState.items, articlesState.sortBy),
);
