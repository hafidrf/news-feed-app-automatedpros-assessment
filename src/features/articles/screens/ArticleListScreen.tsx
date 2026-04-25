import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';

import { RootStackParamList } from '../../../app/navigation/types';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import {
  loadArticles,
  selectSortedArticles,
  selectArticlesState,
  setSortBy,
} from '../articlesSlice';
import { ArticleListItem } from '../components/ArticleListItem';
import { SortToggle } from '../components/SortToggle';
import { StateView } from '../../../shared/components/StateView';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { colors } from '../../../shared/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleList'>;

const ROW_HEIGHT = 124;

export const ArticleListScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const listRef = useRef<FlatList>(null);
  const scrollOffsetRef = useRef(0);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const { loading, error, refreshing, sortBy } = useAppSelector(selectArticlesState);
  const articles = useAppSelector(selectSortedArticles);
  const bookmarkIds = useAppSelector(state => state.bookmarks.ids);
  const visibleArticles = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return articles;
    }

    return articles.filter(article => {
      return (
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.domain.toLowerCase().includes(normalizedQuery) ||
        article.author.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [articles, debouncedQuery]);

  useEffect(() => {
    dispatch(loadArticles(undefined));
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (scrollOffsetRef.current > 0) {
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset({
            offset: scrollOffsetRef.current,
            animated: false,
          });
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    dispatch(loadArticles({ refresh: true }));
  }, [dispatch]);

  const handleNavigateDetail = useCallback(
    (articleId: number) => {
      navigation.navigate('ArticleDetail', { articleId });
    },
    [navigation],
  );

  const onSortChange = useCallback(
    (nextSort: 'score' | 'time') => {
      dispatch(setSortBy(nextSort));
    },
    [dispatch],
  );

  if (loading && articles.length === 0) {
    return <StateView title="Loading top stories..." loading />;
  }

  if (error && articles.length === 0) {
    return (
      <StateView
        title="Unable to load stories"
        subtitle="Pull down to retry once your connection is stable."
      />
    );
  }

  if (!loading && articles.length === 0) {
    return <StateView title="No stories available right now." subtitle="Try again later." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subheading}>Curated from Hacker News</Text>
      <SortToggle value={sortBy} onChange={onSortChange} />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by title, domain, or author"
        style={styles.searchInput}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {visibleArticles.length === 0 ? (
        <StateView
          title="No results found"
          subtitle="Try a different keyword without refreshing data."
        />
      ) : (
        <FlatList
          ref={listRef}
          data={visibleArticles}
          keyExtractor={item => String(item.id)}
          getItemLayout={(_, index) => ({
            length: ROW_HEIGHT,
            offset: ROW_HEIGHT * index,
            index,
          })}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#111827" />
          }
          renderItem={({ item }) => (
            <ArticleListItem
              article={item}
              onPress={handleNavigateDetail}
              isBookmarked={bookmarkIds.includes(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          onScroll={event => {
            scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  subheading: {
    color: '#9db1ce',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#324569',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.white,
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingBottom: 16,
  },
});
