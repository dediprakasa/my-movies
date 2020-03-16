import { gql } from 'apollo-boost'

export const ADD_MOVIE = gql`
mutation (
  $title: String!, 
  $overview: String!, 
  $tags: String, 
  $popularity: Float!, 
  $poster_path: 
  String!) {
    addMovie(
      title: $title, 
      overview: $overview, 
      tags: $tags, 
      popularity: $popularity, 
      poster_path: $poster_path) {
        title,
        overview,
        tags,
        popularity,
        poster_path
  }
}
`

export const GET_MOVIES = gql`
query {
  movies {
    _id
    title
    overview
    poster_path
    popularity
    tags
  }
}
`
export const GET_MOVIE = gql`
query Movie($_id: String){
  movie(_id: $_id) {
    _id
    title
    overview
    poster_path
    popularity
    tags
  }
}
`

export const UPDATE_MOVIE = gql`
mutation (
  $_id: String!
  $title: String!, 
  $overview: String!, 
  $tags: String, 
  $popularity: Float!, 
  $poster_path: 
  String!) {
    updateMovie(
      _id: $_id,
      title: $title, 
      overview: $overview, 
      tags: $tags, 
      popularity: $popularity, 
      poster_path: $poster_path) {
        _id,
        title,
        overview,
        tags,
        popularity,
        poster_path
  }
}
`
export const DELETE_MOVIE = gql`
mutation DeleteMovie($_id: String){
  deleteMovie(_id: $_id) {
    _id
  }
}
`

export const GET_TVS = gql`
query {
  tvs {
    _id
    title
    overview
    poster_path
    popularity
    tags
  }
}
`

export const DELETE_TV = gql`
mutation DeleteTV($_id: String){
  deleteTV(_id: $_id) {
    _id
  }
}
`

export const GET_TV = gql`
query TV($_id: String){
  tv(_id: $_id) {
    _id
    title
    overview
    poster_path
    popularity
    tags
  }
}
`

export const UPDATE_TV = gql`
mutation (
  $_id: String!
  $title: String!, 
  $overview: String!, 
  $tags: String, 
  $popularity: Float!, 
  $poster_path: 
  String!) {
    updateTV(
      _id: $_id,
      title: $title, 
      overview: $overview, 
      tags: $tags, 
      popularity: $popularity, 
      poster_path: $poster_path) {
        _id,
        title,
        overview,
        tags,
        popularity,
        poster_path
  }
}
`

export const ADD_TV = gql`
mutation (
  $title: String!, 
  $overview: String!, 
  $tags: String, 
  $popularity: Float!, 
  $poster_path: 
  String!) {
    addTV(
      title: $title, 
      overview: $overview, 
      tags: $tags, 
      popularity: $popularity, 
      poster_path: $poster_path) {
        title,
        overview,
        tags,
        popularity,
        poster_path
  }
}
`