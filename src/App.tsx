


import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, StatusBar, View } from 'react-native';
import {
  NavigationContainer,
  // DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from './app/hooks.ts';
import { hydrateAuth, store } from './app/store.ts';
import { RootNavigator } from './navigation/RootNavigator.tsx';

function Shell() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(s => s.auth.hydrated);

  console.log('hydrated at Shell: ', hydrated);

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

    <NavigationContainer
      // theme={DarkTheme}
      theme={DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {

  console.log("at APP for ");
  return (
    <Provider store={store}>
      <StatusBar
        // barStyle="light-content"
        barStyle={Platform.OS==='android'?"dark-content":"light-content"}

        // backgroundColor="transparent"
        // translucent
      />
      <Shell />
    </Provider>

    // <HomeScreen/>
  );
}
