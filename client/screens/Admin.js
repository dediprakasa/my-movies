import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, TextInput, StyleSheet, Switch, Alert } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import EditForm from '../components/EditForm'
import { ADD_MOVIE, ADD_TV, GET_MOVIE, GET_MOVIES, GET_TV, GET_TVS } from '../Graphql'
import Toast from 'react-native-tiny-toast'

function AdminPage(props) {
  const [title, onChangeTitle] = useState('')
  const [overview, onChangeOverview] = useState('')
  const [poster_path, onChangePoster] = useState('')
  const [popularity, onChangePopularity] = useState('')
  const [tags, onChangeTags] = useState('')
  const [addMovie, {loading: movieLoading, error: movieError }] = useMutation(ADD_MOVIE)
  const [addTV, {loading: tvLoading, error: tvError }] = useMutation(ADD_TV)
  let { data: movieData } = useQuery(GET_MOVIE, { variables: { _id: getMovieId()}})
  let { data: tvData } = useQuery(GET_TV, { variables: { _id: getTVId()}})
  const [image, setImage] = useState(null)
  const navigation = useNavigation()
  const [toggle, onChangeToggle] = useState(false)
  const [formError, setFormError] = useState(false)

  useFocusEffect(
    useCallback(() => {
      if (movieError || tvError || formError) {
        let toast = Toast.show(`${movieError || tvError || 'All field must be filled out'}`)
        setTimeout(() => {
          Toast.hide(toast) 
        }, 3000)
        setFormError(false)
      }
      return () => {
        props.route.params = undefined
      }
    }, [movieError, tvError, formError])
  )

  function getMovieId() { 
    if (props.route.params && props.route.params.type === 'movie') {
      return props.route.params._id
    }
    return ''
  }

  function getTVId() { 
    if (props.route.params && props.route.params.type === 'tv') {
      return props.route.params._id
    }
    return ''
  }

  function submitForm() {
    if (!title || !overview || !poster_path || !popularity || !tags) {
      setFormError(true)
    } else {
      if (!toggle) {
        addMovie({
          variables: {
            title,
            overview,
            poster_path,
            popularity: parseFloat(popularity),
            tags
          },
          refetchQueries: [{ query: GET_MOVIES }]
        })
        navigation.navigate('Movies')
      } else {
        addTV({
          variables: {
            title,
            overview,
            poster_path,
            popularity: parseFloat(popularity),
            tags
          },
          refetchQueries: [{ query: GET_TVS }]
        })
        navigation.navigate('TVScreen')
      }
      onChangeTitle('')
      onChangeOverview('')
      onChangePoster('')
      onChangePopularity('')
      onChangeTags('')
    }
  }

  function convertedPopularity() {
    if (isReadyMovie()) {
      return movieData.movie.popularity.toString()
    }
    if (popularity) {
      return popularity.toString()
    }
    return ''
  }

  function tagsToString() {
    if (isReadyMovie()) {
      return movieData.movie.tags.toString()
    }
    if (tags) {
      return tags.toString()
    }
    return ''
  }

  function isReadyMovie() {
    if (movieData && movieData.movie && movieData.movie.title) {
      return true
    }
    return false
  }

  function isReadyTV() {
    if (tvData && tvData.tv && tvData.tv.title) {
      return true
    }
    return false
  }

  async function getPermissionAsync() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1
    });

    if (!result.cancelled) {	
      setImage(result.uri);	
    }
  }

  function openImage() {
    getPermissionAsync()
    pickImage()
  }

  function rendedPoster() {
    if (image) {
      return (
        <View style={{alignItems: 'center'}}>
          <Image 
            source={{ uri: image }} 
            style={{ width: 210, height: 280, borderRadius: 10}} />
          <Text style={{fontSize: 8}}>This is beta feature (not fully functioning)</Text>
        </View>
      )
    }
    return <View></View>
  }

  function renderEdit() {
    if (isReadyTV()) {
      return <EditForm entertainData={tvData} />
    }
    if (isReadyMovie()) {
      return <EditForm entertainData={movieData} />
    }
    return <Text>Something's wrong</Text>
  }

  function getMovieTVData() {
    if (isReadyMovie() || isReadyTV()) {
      return (
        <View>
          <Text>Edit</Text>
        </View>
      )
    } else {
      return (
        <View style={{padding: 20, alignItems: 'center'}}>
          <Text style={{fontSize: 25, fontWeight: 'bold', color: 'white'}}>Submit New</Text>
          <View style={{flexDirection: 'row'}}>
            <Text>Movie</Text>
            <Switch
            value={toggle}
            onValueChange={(value) => {
              onChangeToggle(value)
            }}
            thumbColor='red'
          />
            <Text>TV</Text>
          </View>
        </View>
      )
    }
  }

  return (
    <LinearGradient
      colors={['pink', '#FBF4F9']}
      style={styles.screen}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {
        isReadyMovie() || isReadyTV()
        ? renderEdit()
        : (
          <ScrollView>
        {
          getMovieTVData()
        }
        <View style={styles.field_form}>
          <Text style={styles.label}>Title: </Text>
          <TextInput 
            value={title}
            style={styles.input}
            onChangeText={text => onChangeTitle(text)}
          />
        </View>
        <View style={styles.field_form}>
          <Text style={styles.label}>Overview: </Text>
          <TextInput 
            value={overview}
            multiline={true}
            numberOfLines={4}
            style={[styles.input, {height: 80}]}
            onChangeText={text => onChangeOverview(text)}
          />
        </View>
        <View style={styles.field_form}>
          <Text style={styles.label}>Popularity: </Text>
          <TextInput
            keyboardType="numeric" 
            value={convertedPopularity()}
            style={styles.input}
            onChangeText={text => onChangePopularity(text)}
          />
        </View>
        <View style={styles.field_form}>
          <Text style={[styles.label, {marginBottom: 1}]}>Tags: </Text>
          <Text style={{fontSize: 10, marginVertical: 5, color: 'grey'}}>Tags are comma-separated. All whitespaces will be omitted.</Text>
          <TextInput 
            value={tagsToString()}
            style={styles.input}
            onChangeText={text => onChangeTags(text)}
          />
        </View>
        <View style={styles.field_form}>
          <Text style={styles.label}>Poster URL: </Text>
          <TextInput 
            value={poster_path}
            style={styles.input}
            onChangeText={text => onChangePoster(text)}
          />
        </View>
        {
          rendedPoster()
        }
        <TouchableOpacity
          onPress={openImage}
          style={{padding: 20}}>
          <View style={styles.button}>
            <Text style={{fontSize: 15, color: '#fff', fontWeight: 'bold', alignSelf: 'center'}}>Upload Poster</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={submitForm}
          style={{padding: 20}}>
          <View style={styles.button}>
            <Text style={{fontSize: 15, color: '#fff', fontWeight: 'bold', alignSelf: 'center'}}>Submit</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
        )
      }
    </LinearGradient>    
  )
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 3
  },
  field_form: {
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 20,
    justifyContent:'center'
  },
  label: {
    marginBottom: 10
  },
  button: {
    width: '100%', 
    height: 40, 
    backgroundColor: '#E0527A', 
    padding: 10, 
    borderRadius: 20, 
    justifyContent: 'center',
    elevation: 3
  }
})

export default AdminPage