import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFollow } from '../features/leagues/leaguesSlice'

export default function LeagueItem({ league }) {
  const dispatch = useDispatch()
  const followed = useSelector(s => s.leagues.followed.includes(league.id))

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 12,
        backgroundColor: '#fff', 
        marginVertical: 4, 
        borderRadius: 8
      }}
      onPress={() => dispatch(toggleFollow(league.id))}
    >
      <Image source={{ uri: league.logo }} style={{ width: 32, height: 32, marginRight: 12 }} />
      <Text style={{ flex: 1 }}>{league.name}</Text>
      <Text style={{ color: followed ? 'green' : 'gray' }}>
        {followed ? 'Following' : 'Follow'}
      </Text>
    </TouchableOpacity>
  )
}
