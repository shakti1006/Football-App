import axios from 'axios'

export default axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-key': '2a8bcd34dd953dbdbed35d01df5f5530',
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
})
