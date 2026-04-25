import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { removeBookmark } from '../bookmarksSlice';
import { StateView } from '../../../shared/components/StateView';
import { getRelativeTime } from '../../../shared/utils/articleFormatters';
import { colors } from '../../../shared/theme/colors';

export const BookmarksScreen = () => {
  const dispatch = useAppDispatch();
  const bookmarkedArticles = useAppSelector(state =>
    state.bookmarks.ids
      .map(id => state.bookmarks.entities[id])
      .filter(article => article !== undefined),
  );

  if (bookmarkedArticles.length === 0) {
    return (
      <StateView
        title="No bookmarks yet"
        subtitle="Save a story from detail screen, then manage it here."
      />
    );
  }

  const renderRightActions = (id: number) => (
    <Pressable onPress={() => dispatch(removeBookmark(id))} style={styles.swipeAction}>
      <Text style={styles.swipeActionText}>Remove</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={bookmarkedArticles}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <Text style={styles.headerTitle}>Saved Stories</Text>
            <Text style={styles.headerSubtitle}>
              {bookmarkedArticles.length} item{bookmarkedArticles.length > 1 ? 's' : ''} bookmarked
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <View style={styles.item}>
              <View style={styles.itemContent}>
                <Text style={styles.domain}>{item.domain}</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>{getRelativeTime(item.time)}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.meta}>Tap item to review in feed</Text>
                </View>
              </View>
              <Pressable
                onPress={() => dispatch(removeBookmark(item.id))}
                style={styles.removeButton}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          </Swipeable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  contentContainer: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 18,
    minHeight: '100%',
  },
  headerWrap: {
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a3b5f',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    color: colors.white,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#9db1ce',
    fontSize: 13,
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a3b5f',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  domain: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 1,
  },
  meta: {
    color: '#9db1ce',
    fontSize: 12,
  },
  metaDot: {
    color: '#89a0c0',
  },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ff5b86',
    backgroundColor: '#3b1b2a',
  },
  removeText: {
    color: '#ff7ea4',
    fontWeight: '700',
    fontSize: 12,
  },
  swipeAction: {
    width: 96,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.liveRed,
    marginBottom: 10,
    borderRadius: 12,
  },
  swipeActionText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
});
