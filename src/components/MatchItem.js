import React from 'react'
import { View, Text, Image } from 'react-native'

export default function MatchItem({ match }) {
  const { teams, fixture } = match
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#fff',
      marginVertical: 4,
      borderRadius: 8
    }}>
      <Image source={{ uri: teams.home.logo }} style={{ width: 24, height: 24 }} />
      <Text style={{ flex: 1, textAlign: 'center' }}>
        {teams.home.name} {match.goals.home} – {match.goals.away} {teams.away.name}
      </Text>
      <Image source={{ uri: teams.away.logo }} style={{ width: 24, height: 24 }} />
    </View>
  )
}
