import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect } from 'react';
import { Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../../../app/navigation/types';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { getRelativeTime } from '../../../shared/utils/articleFormatters';
import { toggleBookmark } from '../../bookmarks/bookmarksSlice';
import { colors } from '../../../shared/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>;

interface HeaderActionsProps {
  isBookmarked: boolean;
  onShare: () => void;
  onToggleBookmark: () => void;
}

const HeaderActions = ({
  isBookmarked,
  onShare,
  onToggleBookmark,
}: HeaderActionsProps) => (
  <View style={styles.headerActions}>
    <Pressable onPress={onShare}>
      <Text style={styles.headerActionText}>Share</Text>
    </Pressable>
    <Pressable onPress={onToggleBookmark}>
      <Text style={styles.headerActionText}>{isBookmarked ? 'Unsave' : 'Save'}</Text>
    </Pressable>
  </View>
);

export const ArticleDetailScreen = ({ route, navigation }: Props) => {
  const { articleId } = route.params;
  const dispatch = useAppDispatch();

  const article = useAppSelector(state =>
    state.articles.items.find(item => item.id === articleId),
  );
  const bookmarkIds = useAppSelector(state => state.bookmarks.ids);
  const isBookmarked = bookmarkIds.includes(articleId);

  const onToggleBookmark = useCallback(() => {
    if (article) {
      dispatch(toggleBookmark(article));
    }
  }, [dispatch, article]);

  const onShare = useCallback(async () => {
    if (!article) {
      return;
    }
    await Share.share({
      title: article.title,
      message: `${article.title}\n${article.url}`,
    });
  }, [article]);

  const renderHeaderRight = useCallback(
    () => (
      <HeaderActions
        isBookmarked={isBookmarked}
        onShare={() => {
          onShare().catch(() => undefined);
        }}
        onToggleBookmark={onToggleBookmark}
      />
    ),
    [isBookmarked, onShare, onToggleBookmark],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]);

  if (!article) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Story not found in local state.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.metaLabel}>Author: <Text style={styles.metaValue}>{article.author}</Text></Text>
        <Text style={styles.metaLabel}>Score: <Text style={styles.metaValue}>{article.score}</Text></Text>
        <Text style={styles.metaLabel}>
          Published: <Text style={styles.metaValue}>{getRelativeTime(article.time)}</Text>
        </Text>
        <Pressable
          style={styles.linkWrap}
          onPress={() => {
            Linking.openURL(article.url).catch(() => undefined);
          }}>
          <Text style={styles.url}>{article.url}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.primaryBg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2b3b5d',
    gap: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 10,
    lineHeight: 34,
  },
  metaLabel: {
    color: '#9db1ce',
    fontWeight: '600',
  },
  metaValue: {
    color: colors.white,
    fontWeight: '500',
  },
  linkWrap: {
    marginTop: 6,
    backgroundColor: '#122f4b',
    borderRadius: 10,
    padding: 10,
  },
  url: {
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerActionText: {
    color: colors.accent,
    fontWeight: '700',
  },
  emptyText: {
    color: '#4b5563',
  },
});
