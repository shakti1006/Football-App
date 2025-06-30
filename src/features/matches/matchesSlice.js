import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/football'

// dateStr = 'YYYY-MM-DD'
export const fetchMatchesByDate = createAsyncThunk(
  'matches/fetchByDate',
  async (dateStr) => {
    const resp = await api.get('/fixtures', { params: { date: dateStr } })
    return resp.data.response
  }
)

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
    byDate: {},   // e.g. { '2025-06-30': [ {...}, ... ] }
    status: 'idle'
  },
  extraReducers: builder => {
    builder.addCase(fetchMatchesByDate.fulfilled, (state, action) => {
      const date = action.meta.arg
      state.byDate[date] = action.payload
    })
  }
})

export default matchesSlice.reducer
