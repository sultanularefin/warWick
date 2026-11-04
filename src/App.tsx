/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

/*import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;*/


import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from './app/hooks.ts';
import { hydrateAuth, store } from './app/store.ts';
import { RootNavigator } from './navigation/RootNavigator.tsx';

// import { store, hydrateAuth } from './src/app/store';
// import { useAppDispatch, useAppSelector } from './src/app/hooks';
// import { RootNavigator } from './src/navigation/RootNavigator';

function Shell() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(s => s.auth.hydrated);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0F0C29',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color="#A78BFA" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Shell />
    </Provider>
  );
}
