import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLeagues,
  loadFollowed,
  toggleFollow
} from '../features/leagues/leaguesSlice'

export default function LeaguesScreen() {
  const dispatch = useDispatch()
  const allEntries = useSelector(s => s.leagues.all)       // raw API objects
  const followedIds = useSelector(s => s.leagues.followed)  // [39,61,…]

  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuggested, setShowSuggested] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState({})

  // 1. Load data on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      dispatch(loadFollowed()),
      dispatch(fetchLeagues())
    ]).finally(() => setLoading(false))
  }, [])

  // Show loader until data arrives
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={25} color={'#4CAF50'} />
        <Text style={styles.loadingText}>Loading leagues</Text>
      </View>
    )
  }

  // 2. Build Following & Suggested lists
  const following = allEntries
    .filter(e => followedIds.includes(e.league.id))
    .map(e => e.league)

  const suggested = allEntries
    .filter(e => !followedIds.includes(e.league.id))
    .slice(0, 7)
    .map(e => e.league)

  // 3. Build “All competitions” groups
  const suggestedSet = new Set(suggested.map(l => l.id))
  const remaining = allEntries
    .filter(e =>
      !followedIds.includes(e.league.id) &&
      !suggestedSet.has(e.league.id)
    )
    .map(e => {
      const code = e.country.code?.toLowerCase()
      return {
        country: e.country.name,
        flag:    `https://flagcdn.com/48x36/${code}.png`,
        league:  e.league
      }
    })


  // Group by country
  const byCountry = remaining.reduce((acc, { country,flag, league }) => {
    if (!acc[country]) acc[country] = { flag, leagues: [] }
    acc[country].leagues.push(league)
    return acc
  }, {})

  // Desired order
  const priority = [
    'India',
    'International - national teams',
    'International - clubs'
  ]
  const otherCountries = Object.keys(byCountry)
    .filter(c => !priority.includes(c))
    .sort((a,b) => a.localeCompare(b))
  const groupOrder = [
    ...priority.filter(c => byCountry[c]),
    ...otherCountries
  ]

  // Toggle expand/collapse
  const toggleGroup = country => {
    setExpandedGroups(g => ({ ...g, [country]: !g[country] }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        {/* ——— FOLLOWING ——— */}
        {following.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={[styles.sectionTitle, { flex: 1 }]}>
                Following
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditing(e => !e)}
              >
                <Text style={styles.editBtn}>
                  {isEditing ? 'Done' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            {following.map(league => (
              <View key={league.id} style={styles.row}>
                {isEditing && (
                  <TouchableOpacity
                    onPress={() => dispatch(toggleFollow(league.id))}
                  >
                    <Icon
                      name="remove-circle-outline"
                      size={24}
                      color="red"
                      style={{ marginRight: 12 }}
                    />
                  </TouchableOpacity>
                )}
                <Image
                  source={{ uri: league.logo }}
                  style={styles.logo}
                />
                <Text style={styles.name}>{league.name}</Text>
                {isEditing && (
                  <Icon name="drag-handle" size={20} color="#999" />
                )}
              </View>
            ))}
          </View>
        )}

        {/* ——— SUGGESTED ——— */}
        {showSuggested && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={[styles.sectionTitle, { flex: 1 }]}>
                Suggested
              </Text>
              <TouchableOpacity onPress={() => setShowSuggested(false)}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {suggested.map(league => (
              <View key={league.id} style={styles.row}>
                <Image source={{ uri: league.logo }} style={styles.logo} />
                <Text style={styles.name}>{league.name}</Text>
                <TouchableOpacity
                  style={styles.followBtn}
                  onPress={() => dispatch(toggleFollow(league.id))}
                >
                  <Text style={styles.followBtnText}>Follow</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* ——— ALL COMPETITIONS ——— */}
        <Text style={styles.sectionTitle2}>All competitions</Text>
        {groupOrder.map(country => {
          const { flag, leagues } = byCountry[country]
          const expanded = !!expandedGroups[country]

          return (
            <View key={country} style={styles.card1}>
              <TouchableOpacity
                style={styles.cardHeader1}
                onPress={() => toggleGroup(country)}
              >
                <Image
                  source={{ uri: flag }}
                  style={styles.countryLogo}
                />
                <Text style={[styles.sectionTitle1, { flex: 1 }]}>
                  {country}
                </Text>
                <Icon
                  name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>

              {expanded &&
                leagues.map(league => (
                  <View key={league.id} style={styles.row}>
                    <Image
                      source={{ uri: league.logo }}
                      style={styles.logo}
                    />
                    <Text style={styles.name}>{league.name}</Text>
                    <TouchableOpacity
                      style={styles.followBtn}
                      onPress={() => dispatch(toggleFollow(league.id))}
                    >
                      <Text style={styles.followBtnText}>Follow</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    marginBottom: 16,
    elevation: 1
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  card1: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    padding: 0,
    overflow: 'hidden'
  },
  cardHeader1: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9'
  },
  countryLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 12
  },
  sectionTitle1: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  editBtn: {
    color: 'green',
    fontSize: 16
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // borderTopWidth: 1,
    // borderColor: '#eee'
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 12
  },
  name: {
    flex: 1,
    fontSize: 14
  },
  followBtn: {
    borderWidth: 1,
    borderColor: '#909090',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  sectionTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    paddingHorizontal: 16
  },
})
