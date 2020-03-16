import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet, Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler'
import { useMutation } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native'
import { DELETE_MOVIE, GET_MOVIES, GET_TVS, DELETE_TV } from '../Graphql'

function EntertainCard({ entertainData, type }) {
  const [deleteMovie] = useMutation(DELETE_MOVIE)
  const [deleteTV] = useMutation(DELETE_TV)
  const navigation = useNavigation()
  function DefaultImg() {
    return (
      <Image style={{width: 70, height: 70, alignSelf: 'center'}} source={require('../assets/movie.png')}/>
    )
  }

  function handleDelete(_id) {
    Alert.alert(
      'Deletion Confirmation',
      `Are you sure you want to delete selected ${type}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete', 
          onPress: () => {
            if (type === 'movie') {
              deleteMovie({
                variables: {
                  _id
                },
                refetchQueries: [{ query: GET_MOVIES }]
              })
            } else if (type === 'tv') {
              deleteTV({
                variables: {
                  _id
                },
                refetchQueries: [{ query: GET_TVS }]
              })
            }
          }
        },
      ],
      {cancelable: true},
    );
  }

  function handleUpdate(_id) {
    navigation.navigate('Admin', { _id, type })
  }

  return (
    <View style={styles.card}>
      {
        entertainData.poster_path
        ? (
          <View style={styles.img}>
            <Image
              style={{width: '100%', height: '100%', borderRadius: 10}}
              source={{uri: `${entertainData.poster_path}`}} 
              />
          </View>
        )
        : <View style={styles.img}>{DefaultImg()}</View>
      }
      <View style={styles.info}>
        <TouchableOpacity
          style={{height: '100%'}}
          onPress={() => {
            if (type === 'movie') {
              navigation.navigate('Movie Details', { type, data: entertainData })
            } else if (type === 'tv') {
              navigation.navigate('TV Details', { type, data: entertainData })
            }
          }}
        >
          <View>
            <Text>{entertainData.title}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
              <Image
                style={{width: 15, height: 15, marginRight: 2}}
                source={require('../assets/star.png')} 
              />
              <Text style={{fontSize: 10}}>{entertainData.popularity}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
            {
              entertainData.tags.length > 0
              ? (
                entertainData.tags.map(tag => {
                  return <Text key={tag} style={styles.tag}>{tag}</Text>
                })
              )
              : <Text></Text>
            }
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.btn_container}>
      <TouchableOpacity 
        onPress={() => {
          handleUpdate(entertainData._id)
        }}
        style={styles.btn}
        >
          <View
          >
            <Icon 
              name='ios-create'
              type='ionicon'
              color='#fff'
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            handleDelete(entertainData._id)
          }}
          style={styles.btn}
          >
          <View
          >
            <Icon 
              name='ios-trash'
              type='ionicon'
              color='#fff'
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width: '80%',
    height: 150,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#fff'
  },
  img: {
    width: 100,
    height: 150,
    marginTop: -30,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 10,
    justifyContent: 'center'
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
    height: '100%'
  },
  btn: {
    width: 40, 
    height: 30, 
    borderRadius: 5, 
    marginBottom: -20,
    backgroundColor: '#EB645F',
    marginRight: 10,
    alignContent: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  btn_container: {
    flexDirection: 'row', 
    marginLeft: 'auto', 
    zIndex: 90, 
    position: 'absolute', 
    marginBottom: -15, 
    right: 0, 
    bottom: 0, 
    height: 35
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
    textAlignVertical: 'center'
  }
})

export default EntertainCard