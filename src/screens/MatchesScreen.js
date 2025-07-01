import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatchesByDate } from '../features/matches/matchesSlice'
import { loadFollowed } from '../features/leagues/leaguesSlice'
import MatchItem from '../components/MatchItem'
import { format, addDays } from 'date-fns'

export default function MatchesScreen() {
  const dispatch      = useDispatch()
  const followed      = useSelector(s => s.leagues.followed)
  const matchesByDate = useSelector(s => s.matches.byDate)
  const [dayOffset,   setDayOffset]   = useState(0)
  const [loading,     setLoading]     = useState(true)

  const dateStr = format(addDays(new Date(), dayOffset), 'yyyy-MM-dd')

  // Load followed leagues once
  useEffect(() => {
    dispatch(loadFollowed())
  }, [])

  // Fetch fixtures whenever the date changes
  useEffect(() => {
    setLoading(true)
    dispatch(fetchMatchesByDate(dateStr))
      .finally(() => setLoading(false))
  }, [dateStr])

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading matches…</Text>
      </View>
    )
  }

  const allMatches       = matchesByDate[dateStr] || []
  const followingMatches = allMatches.filter(m =>
    followed.includes(m.league.id)
  )

  const sections = [
    { title: 'Following',  data: followingMatches },
    { title: 'All Leagues', data: allMatches }
  ]

  const Header = () => (
    <View style={styles.headerContainer}>
      {[-1, 0, 1].map(offset => {
        const label = offset === -1 ? 'Yesterday'
                     : offset === 0 ? 'Today'
                     : 'Tomorrow'
        return (
          <TouchableOpacity
            key={offset}
            onPress={() => setDayOffset(offset)}
          >
            <Text style={[
              styles.headerButtonText,
              dayOffset === offset && styles.headerButtonTextActive
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header/>

      <SectionList
        sections={sections}
        keyExtractor={item => item.fixture.id.toString()}
        renderItem={({ item }) => <MatchItem match={item} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>
              {section.title}
            </Text>
            {section.data.length === 0 && (
              <Text style={styles.noDataText}>
                No matches
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noDataText}>
            No matches available
          </Text>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555'
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  headerButtonText: {
    fontSize: 16,
    color: '#444'
  },
  headerButtonTextActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF'
  },

  sectionHeader: {
    paddingVertical: 8,
    alignItems: 'center'        // center all header content
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  noDataText: {
    marginTop: 4,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center'
  }
})
