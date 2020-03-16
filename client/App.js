import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import RootNavigation from './navigations/RootNavigation'
import { ApolloProvider } from '@apollo/react-hooks'
import apolloClient from './graphql'
import Constants from 'expo-constants'

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <View style={styles.container}>
          <RootNavigation />
        </View>
      </NavigationContainer>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight
  },
});
