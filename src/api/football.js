import axios from 'axios'

export default axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-key': '11a44485ed323c8ece8f9c585836e251',
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
})
