import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { StyleSheet } from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/store';
import { ArticleDetailScreen } from '../../features/articles/screens/ArticleDetailScreen';
import { ArticleListScreen } from '../../features/articles/screens/ArticleListScreen';
import { loadBookmarks, saveBookmarks } from '../../features/bookmarks/bookmarkStorage';
import { hydrateBookmarks } from '../../features/bookmarks/bookmarksSlice';
import { RootStackParamList, RootTabParamList } from './types';
import { BookmarksScreen } from '../../features/bookmarks/screens/BookmarksScreen';
import { OfflineBanner } from '../../shared/components/OfflineBanner';
import { colors } from '../../shared/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const FeedStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700', color: colors.white },
        contentStyle: { backgroundColor: colors.primaryBg },
      }}>
      <Stack.Screen
        name="ArticleList"
        component={ArticleListScreen}
        options={{ title: 'Top Stories' }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: 'Story Detail' }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector(state => state.bookmarks);
  const [bookmarksHydrated, setBookmarksHydrated] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const snapshot = await loadBookmarks();
      dispatch(hydrateBookmarks(snapshot));
      setBookmarksHydrated(true);
    };

    hydrate().catch(() => setBookmarksHydrated(true));
  }, [dispatch]);

  useEffect(() => {
    if (!bookmarksHydrated) {
      return;
    }
    saveBookmarks(bookmarks).catch(() => undefined);
  }, [bookmarks, bookmarksHydrated]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(state.isConnected === false);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {isOffline ? <OfflineBanner /> : null}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.slate400,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.tabBar,
        }}>
        <Tab.Screen name="FeedStack" component={FeedStackNavigator} options={{ title: 'Feed' }} />
        <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontWeight: '600',
    fontSize: 12,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: '#20304f',
    borderTopWidth: 1,
    height: 62,
    paddingTop: 6,
  },
});
