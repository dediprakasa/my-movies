import React from 'react'
import { View, Text, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MovieStackNavigation from './MovieStackNavigation'
import TVStackNavigation from './TVStackNavigation'
import AdminStackNavigation from './AdminStackNavigation'
import AdminPage from '../screens/Admin'
import { Icon } from 'react-native-elements'


const Tab = createBottomTabNavigator()

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Movie"
        component={MovieStackNavigation}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: () => (
            <Icon 
              name='movie'
              type='material-icons'
              color='pink'
            />
          ),
        }}
        />
      <Tab.Screen
        name="TV"
        component={TVStackNavigation} 
        options={{
          tabBarLabel: 'TVs',
          tabBarIcon: () => (
            <Icon 
              name='tv'
              type='material-icons'
              color='pink'
            />
          ),
        }}
        />
      <Tab.Screen
        name="Admin"
        component={AdminPage}
        options={
        {
          unmountOnBlur: true,
          tabBarLabel: 'Add New',
          tabBarIcon: () => (
            <Icon 
              name='queue'
              type='material-icons'
              color='pink'
            />
          )
        }
      } />
    </Tab.Navigator>
  )
}

export default MyTabs