import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Article } from '../../../shared/types/article';
import { getRelativeTime } from '../../../shared/utils/articleFormatters';
import { colors } from '../../../shared/theme/colors';

interface ArticleListItemProps {
  article: Article;
  onPress: (id: number) => void;
  isBookmarked: boolean;
}

const ArticleListItemComponent = ({
  article,
  onPress,
  isBookmarked,
}: ArticleListItemProps) => {
  return (
    <Pressable style={styles.container} onPress={() => onPress(article.id)}>
      <View style={styles.topRow}>
        <Image source={{ uri: article.faviconUrl }} style={styles.favicon} />
        <Text style={styles.domain}>{article.domain}</Text>
        {isBookmarked ? <Text style={styles.bookmark}>Saved</Text> : null}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{article.score} points</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.meta}>{getRelativeTime(article.time)}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export const ArticleListItem = memo(ArticleListItemComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#263553',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  favicon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  domain: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    flex: 1,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    color: '#b6c6dd',
    fontSize: 12.5,
  },
  dot: {
    color: '#9eb1cc',
  },
  bookmark: {
    color: colors.primaryBg,
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
  },
});
