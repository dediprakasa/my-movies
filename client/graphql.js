import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
  uri: 'http://35.184.17.186:4000',
  onError: (e) => { console.log(e) }
})

export default client