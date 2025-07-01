import axios from 'axios'

export default axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-key': '4304b7750054de048d5046f97fcc7994',
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
})
