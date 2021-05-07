import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CallOneScene, CallTwoScene, HomeScene } from '../scenes';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerLeft: () => null }}>
        <Stack.Screen name="Home" component={HomeScene} />
        <Stack.Screen name="CallOne" component={CallOneScene} />
        <Stack.Screen name="CallTwo" component={CallTwoScene} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
