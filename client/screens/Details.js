import React, { useEffect, useCallback, useState } from 'react'
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'

function Details(props) {
  const [type, setType] = useState('')
  useEffect(() => {
    if (props.route.params.type === 'movie') {
      setType(props.route.params.data)
    } else if (props.route.params.type === 'tv') {
      setType(props.route.params.data)
    }
  }, [])
  return (
    <LinearGradient
        colors={['pink', '#FBF4F9']}
        style={styles.screen}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
      <ScrollView style={{width: '100%', padding: 20}}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.image}>
            <Image
              style={{width: '100%', height: '100%', borderRadius: 10, borderWidth: 2}}
              source={{uri: `${type.poster_path}`}} 
            />
          </View>
          <View style={{padding: 10}}>
            <Text style={styles.title}>{type.title}</Text>
            
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
              <Image
                style={{width: 15, height: 15, marginRight: 2}}
                source={require('../assets/star.png')} 
              />
              <Text style={{fontSize: 10}}>{type.popularity}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {
                type.tags && type.tags.length > 0
                ? (
                  type.tags.map(tag => {
                    return <Text key={tag} style={styles.tag}>{tag}</Text>
                  })
                )
                : <Text></Text>
              }
            </View>

          </View>
        </View>
        <View style={{marginVertical: 10}}>
          <Text style={styles.title}>Overview</Text>
          <Text style={styles.overview}>{type.overview}</Text>
        </View>
      </ScrollView>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 200,
    resizeMode: 'contain'
  },
  screen: {
    flex: 1,
    backgroundColor: '#ECECEC'
  },
  tag: {
    paddingHorizontal: 5, 
    paddingVertical: 2, 
    borderWidth: 2, 
    borderColor: 'pink', 
    marginRight: 2, 
    borderRadius: 10, 
    fontSize: 10, 
    textAlign: 'center', 
    textAlignVertical: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555555'
  },
  overview: {
    lineHeight: 22,
    textAlign: 'justify', 
    fontSize: 16
  }
})

export default Details