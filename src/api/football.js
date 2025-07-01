import axios from 'axios'

export default axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-key': '4fdfbd0168516e6feb9986eaf336b2c1',
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
})
