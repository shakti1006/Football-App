import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  StatusBar,
  StyleSheet
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatchesByDate } from '../features/matches/matchesSlice'
import { loadFollowed } from '../features/leagues/leaguesSlice'
import MatchItem from '../components/MatchItem'
import { format, addDays } from 'date-fns'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function MatchesScreen() {
  const dispatch      = useDispatch()
  const followed      = useSelector(s => s.leagues.followed)
  const matchesByDate = useSelector(s => s.matches.byDate)
  const [dayOffset,   setDayOffset]   = useState(0)
  const [loading,     setLoading]     = useState(true)

  const dateStr = format(addDays(new Date(), dayOffset), 'yyyy-MM-dd')

  // 1) Load your followed leagues once
  useEffect(() => {
    dispatch(loadFollowed())
  }, [])

  // 2) Fetch fixtures whenever the date changes
  useEffect(() => {
    setLoading(true)
    dispatch(fetchMatchesByDate(dateStr))
      .finally(() => setLoading(false))
  }, [dateStr])

  // 3) Loader
  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading matches…</Text>
      </SafeAreaView>
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

  // ——— Top App Bar ———
  const AppBar = () => (
    <View style={styles.appBar}>
      <Text style={styles.logoText}>FOTMOB</Text>
      <View style={styles.appBarIcons}>
        <Icon name="schedule"          size={24} style={styles.icon} />
        <Icon name="calendar-today"    size={24} style={styles.icon} />
        <Icon name="search"            size={24} style={styles.icon} />
        <Icon name="more-vert"         size={24} style={styles.icon} />
      </View>
    </View>
  )

  // ——— Tab Bar ———
  const TabBar = () => (
    <View style={styles.tabBar}>
      {[-1, 0, 1].map(offset => {
        const label = offset === -1
          ? 'Yesterday'
          : offset === 0
            ? 'Today'
            : 'Tomorrow'
        const active = offset === dayOffset
        return (
          <TouchableOpacity
            key={offset}
            style={[styles.tabButton, active && styles.tabButtonActive]}
            onPress={() => setDayOffset(offset)}
          >
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <AppBar />
      <TabBar />

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
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  loaderContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555'
  },

  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff'
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  appBarIcons: {
    flexDirection: 'row'
  },
  icon: {
    marginLeft: 16,
    color: '#333'
  },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderColor: '#007AFF'
  },
  tabLabel: {
    fontSize: 16,
    color: '#444'
  },
  tabLabelActive: {
    fontWeight: 'bold',
    color: '#007AFF'
  },

  sectionHeader: {
    marginTop: 24,
    alignItems: 'center'
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  noDataText: {
    marginTop: 4,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center'
  }
})
