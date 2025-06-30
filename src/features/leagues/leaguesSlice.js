import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../api/football'

// Fetch all leagues
export const fetchLeagues = createAsyncThunk('leagues/fetch', async () => {
  const resp = await api.get('/leagues')
  return resp.data.response
})

// Load followed IDs from storage
export const loadFollowed = createAsyncThunk('leagues/loadFollowed', async () => {
  const json = await AsyncStorage.getItem('followedLeagues')
  return json ? JSON.parse(json) : []
})

const leaguesSlice = createSlice({
  name: 'leagues',
  initialState: {
    all: [],
    followed: [],
    status: 'idle'
  },
  reducers: {
    toggleFollow: (state, action) => {
      const id = action.payload
      if (state.followed.includes(id)) {
        state.followed = state.followed.filter(x => x !== id)
      } else {
        state.followed.push(id)
      }
      AsyncStorage.setItem('followedLeagues', JSON.stringify(state.followed))
    }
  },
  extraReducers: builder => {
    builder
        .addCase(fetchLeagues.fulfilled, (state, action) => {
            state.all = action.payload
            state.status = 'succeeded'
        })
        .addCase(loadFollowed.fulfilled, (state, action) => {
        state.followed = (action.payload || [])
            .filter(id => typeof id === 'number')
        })

  }
})

export const { toggleFollow } = leaguesSlice.actions
export default leaguesSlice.reducer
