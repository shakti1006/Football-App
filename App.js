import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider } from 'react-redux'
import { store } from './src/store'

import SplashScreen  from './src/screens/SplashScreen'
import TabsNavigator from './src/navigation/TabsNavigator'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home"   component={TabsNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
