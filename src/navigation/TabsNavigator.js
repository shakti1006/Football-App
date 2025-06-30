import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MatchesScreen from '../screens/MatchesScreen'
import LeaguesScreen from '../screens/LeaguesScreen'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Tab = createBottomTabNavigator()

export default function TabsNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let name = route.name === 'Matches' ? 'sports-soccer'
                   : route.name === 'Leagues' ? 'emoji-events'
                   : 'circle'
          return <Icon name={name} size={size} color={color} />
        }
      })}>
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Leagues" component={LeaguesScreen} />
    </Tab.Navigator>
  )
}
