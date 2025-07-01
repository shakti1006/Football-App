import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialIcons'

// import your screens here
import MatchesScreen from '../screens/MatchesScreen'
import NewsScreen from '../screens/NewsScreen'
import LeaguesScreen from '../screens/LeaguesScreen'
import FollowingScreen from '../screens/FollowingScreen'
import MoreScreen from '../screens/MoreScreen'

const Tab = createBottomTabNavigator()

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // headerShown: false,          // hide top header on all
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIcon: ({ color, size }) => {
          let iconName

          switch (route.name) {
            case 'Matches':
              iconName = 'sports-soccer'
              break
            case 'News':
              iconName = 'article'
              break
            case 'Leagues':
              iconName = 'emoji-events'
              break
            case 'Following':
              iconName = 'star-border'
              break
            case 'More':
              iconName = 'menu'
              break
          }

          return <Icon name={iconName} size={size} color={color} />
        }
      })}
      >
      <Tab.Screen name="Matches" component={MatchesScreen} options={{headerShown:false}}/>
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Leagues" component={LeaguesScreen} />
      <Tab.Screen name="Following" component={FollowingScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  )
}
