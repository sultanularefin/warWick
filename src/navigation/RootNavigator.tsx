import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../app/hooks';
import { LoginScreen } from '../screens/LoginScreen';
// import { SignupScreen } from '../screens/SignupScreen';
import { HomeScreen } from '../screens/HomeScreen';
// import RegistrationScreen from '../screens/RegistrationScreen.tsx';
import RegScreen from '../screens/RegScreen.tsx';
import { SignupScreen } from '../screens/SignupScreen.tsx';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  RegistrationScreen: undefined;
  RegScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const token = useAppSelector(s => s.auth.token);

  console.log('token: at __ RootNavigator__ : : ', token);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F0C29' },
        animation: 'fade',
      }}
    >
      {token ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          {/*<Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
          />*/}

          <Stack.Screen name="RegScreen" component={RegScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
