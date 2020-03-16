import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import TVScreen from '../screens/TVScreen'
import Details from '../screens/Details'

const Stack = createStackNavigator()

function TVStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TVScreen"
        component={TVScreen}
        options={{
          title: 'TV Series',
          headerStyle: {
            backgroundColor: '#F1ACD6',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white'
          },
          headerStatusBarHeight: 0
        }}
      />
      <Stack.Screen
        name="TV Details"
        component={Details}
        options={{
          headerStyle: {
            backgroundColor: '#F1ACD6',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white'
          },
          headerStatusBarHeight: 0
        }}
    />
    </Stack.Navigator>
  )
}

export default TVStack