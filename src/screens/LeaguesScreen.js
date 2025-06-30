import React, { useEffect } from 'react'
import { SectionList, SafeAreaView, View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLeagues, loadFollowed } from '../features/leagues/leaguesSlice'
import LeagueItem from '../components/LeagueItem'

export default function LeaguesScreen() {
    const dispatch = useDispatch()
    const { all, followed, status } = useSelector(s => s.leagues)

    useEffect(() => {
        dispatch(loadFollowed())
        dispatch(fetchLeagues())
    }, [])

    const followedLeagues = all
    .filter(entry => followed.includes(entry.league.id))
    .map(entry  => entry.league)

    const suggested = all
    .filter(entry => !followed.includes(entry.league.id))
    .map(entry  => entry.league)

    const sections = [
        { title: 'Following', data: followedLeagues },
        { title: 'Suggested', data: suggested }
    ]

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
        {status === 'idle' && <Text>Loading…</Text>}
        <SectionList
            sections={sections}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <LeagueItem league={item} />}
            renderSectionHeader={({ section }) => (
            <View style={{ paddingVertical: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{section.title}</Text>
            </View>
            )}
        />
        </SafeAreaView>
    )
}
