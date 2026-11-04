


import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from './app/hooks.ts';
import { hydrateAuth, store } from './app/store.ts';
import { RootNavigator } from './navigation/RootNavigator.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';

// import { store, hydrateAuth } from './src/app/store';
// import { useAppDispatch, useAppSelector } from './src/app/hooks';
// import { RootNavigator } from './src/navigation/RootNavigator';

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
    <NavigationContainer theme={DarkTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {

  console.log("at APP for ");
  return (
    /*<Provider store={store}>
      <Shell />
    </Provider>*/

    <HomeScreen/>


  );
}
