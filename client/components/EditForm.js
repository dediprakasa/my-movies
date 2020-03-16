import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, TextInput, StyleSheet } from 'react-native'
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'
import { gql } from 'apollo-boost'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { useNavigation } from '@react-navigation/native'
import { GET_TVS, GET_MOVIES, UPDATE_MOVIE, UPDATE_TV } from '../Graphql'
import Toast from 'react-native-tiny-toast'


function EditForm({ entertainData }) {
  const [title, onChangeTitle] = useState(initialData().title)
  const [overview, onChangeOverview] = useState(initialData().overview)
  const [poster_path, onChangePoster] = useState(initialData().poster_path)
  const [popularity, onChangePopularity] = useState(initialData().popularity.toString())
  const [tags, onChangeTags] = useState(initialData().tags.toString())
  const [updateMovie, {loading: movieLoading, error: movieError, data: movieData }] = useMutation(UPDATE_MOVIE)
  const [updateTV, {loading: tvLoading, error: tvError, data: tvData }] = useMutation(UPDATE_TV)
  const [image, setImage] = useState(null)
  const navigation = useNavigation()
  const [formError, setFormError] = useState(false)

  useEffect(() => {
    if (movieError || tvError || formError) {
      let toast = Toast.show(`${movieError || tvError || 'All field must be filled out'}`)
      setTimeout(() => {
        Toast.hide(toast) 
      }, 3000)
      setFormError(false)
    }
  }, [movieError, tvError, formError])

  function initialData() {
    if (isReadyMovie()) {
      return {
        title: entertainData.movie.title,
        overview: entertainData.movie.overview,
        poster_path: entertainData.movie.poster_path,
        popularity: entertainData.movie.popularity,
        tags: entertainData.movie.tags
      }
    }
    if (isReadyTV()) {
      return {
        title: entertainData.tv.title,
        overview: entertainData.tv.overview,
        poster_path: entertainData.tv.poster_path,
        popularity: entertainData.tv.popularity,
        tags: entertainData.tv.tags
      }
    }
  }

  function submitForm() {
    if (!title || !overview || !poster_path || !popularity || !tags) {
      setFormError(true)
    } else {
      if (isReadyMovie()) {
        updateMovie({
          variables: {
            _id: entertainData.movie._id,
            title,
            overview,
            poster_path,
            popularity: parseFloat(popularity),
            tags
          },
          refetchQueries: [{ query: GET_MOVIES }]
        })
        navigation.navigate('Movies')
      } else if (isReadyTV()) {
        updateTV({
          variables: {
            _id: entertainData.tv._id,
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
      return entertainData.movie.popularity.toString()
    }
    if (popularity) {
      return popularity.toString()
    }
    return ''
  }

  function tagsToString() {
    return initialData().tags.toString()
  }

  function isReadyMovie() {
    if (entertainData && entertainData.movie && entertainData.movie.title) {
      return true
    }
    return false
  }

  function isReadyTV() {
    if (entertainData && entertainData.tv && entertainData.tv.title) {
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

  return (
    <ScrollView>
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
          value={popularity}
          style={styles.input}
          onChangeText={text => onChangePopularity(text)}
        />
      </View>
      <View style={styles.field_form}>
      <Text style={[styles.label, {marginBottom: 1}]}>Tags: </Text>
          <Text style={{fontSize: 10, marginVertical: 5, color: 'grey'}}>Tags are comma-separated. All whitespaces will be omitted.</Text>
        <TextInput 
          value={tags}
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
          <Text style={{fontSize: 15, color: '#fff', fontWeight: 'bold', alignSelf: 'center'}}>Save Changes</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
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

export default EditForm