import React from 'react'
import { Text} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import MovieScreen from '../screens/MovieScreen'
import Details from '../screens/Details'

const Stack = createStackNavigator()

function MovieStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Movies"
        component={MovieScreen}
        options={{
          title: 'Movies',
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
        name="Movie Details"
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

export default MovieStack