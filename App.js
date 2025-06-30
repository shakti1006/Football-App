import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { store } from './src/store'
import TabsNavigator from './src/navigation/TabsNavigator'

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabsNavigator />
      </NavigationContainer>
    </Provider>
  )
}
