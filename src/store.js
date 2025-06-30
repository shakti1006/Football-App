import { configureStore } from '@reduxjs/toolkit'
import leaguesReducer from './features/leagues/leaguesSlice'
import matchesReducer from './features/matches/matchesSlice'

export const store = configureStore({
  reducer: {
    leagues: leaguesReducer,
    matches: matchesReducer,
  },
})
