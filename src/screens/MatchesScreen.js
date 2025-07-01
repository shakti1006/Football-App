import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, SectionList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatchesByDate } from '../features/matches/matchesSlice'
import { loadFollowed } from '../features/leagues/leaguesSlice'
import MatchItem from '../components/MatchItem'
import { format, addDays } from 'date-fns'

export default function MatchesScreen() {
  const dispatch = useDispatch()
  const followed      = useSelector(s => s.leagues.followed)      // [ 39, 61, … ]
  const matchesByDate = useSelector(s => s.matches.byDate)       // { '2025-06-30': [ … ] }
  const [dayOffset, setDayOffset] = useState(0)
  const dateStr = format(addDays(new Date(), dayOffset), 'yyyy-MM-dd')

  // 1) Load your followed leagues once
  useEffect(() => {
    dispatch(loadFollowed())
  }, [])

  // 2) Fetch fixtures whenever the date changes
  useEffect(() => {
    dispatch(fetchMatchesByDate(dateStr))
  }, [dateStr])

  // 3) (Optional) Debug
  // console.log('FOLLOWED IDs:', followed)
  // console.log('MATCH LEAGUE IDs:', (matchesByDate[dateStr] || []).map(m => m.league.id))

  const allMatches       = matchesByDate[dateStr] || []
  const followingMatches = allMatches.filter(m => followed.includes(m.league.id))

  const sections = [
    { title: 'Following',  data: followingMatches },
    { title: 'All Leagues', data: allMatches }
  ]

  const Header = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 16 }}>
      {[-1, 0, 1].map(offset => {
        const label = offset===-1 ? 'Yesterday' : offset===0 ? 'Today' : 'Tomorrow'
        return (
          <TouchableOpacity key={offset} onPress={() => setDayOffset(offset)}>
            <Text style={{
              fontWeight: dayOffset===offset ? 'bold' : 'normal',
              fontSize: 16
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )

  return (
    <SafeAreaView style={{ flex:1, padding:16 }}>
      <Header/>

      <SectionList
        sections={sections}
        keyExtractor={item => item.fixture.id.toString()}
        renderItem={({ item }) => <MatchItem match={item} />}
        // If you want “Following” to show even when empty, remove the length check
        renderSectionHeader={({ section }) => (
            <View style={{ paddingVertical: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {section.title}
                </Text>
                {section.data.length === 0 && (
                <Text style={{ fontStyle: 'italic', color: '#666' }}>
                    No matches for your leagues
                </Text>
                )}
            </View>
        )}

        ListEmptyComponent={
          <Text style={{ textAlign:'center', marginTop:20 }}>
            No matches
          </Text>
        }
      />
    </SafeAreaView>
  )
}
