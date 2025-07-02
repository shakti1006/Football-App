import axios from 'axios'

export default axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-key': '781dc739cf9751c1a9f58ae192afb047',
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
})
