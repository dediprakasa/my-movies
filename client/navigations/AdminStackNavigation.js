import React from 'react'
import { Text} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import AdminPage from '../screens/Admin'

const Stack = createStackNavigator()

function AdminStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
      name="FormPage"
      component={AdminPage}
      options={{
        title: 'Form Page',
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

export default AdminStackNavigation