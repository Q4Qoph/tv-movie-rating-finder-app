import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

const saved = () => {
  return (
    <View className='bg-primary flex-1 px-10'>
          <View className='flex justify-center items-center flex-1 flex-col gap-5'>
            <Image source={icons.save} className='size-10' tintColor="#Fff"/>
            <Text className='text-gray-500 text-base'>Saved</Text>        
          </View>
        </View>
  )
}

export default saved

// work with appright , persitant storage similler to traking our metric right now 
// instaded of searches, track the clicks  on say a heart on spesicifc movie for example 
// the create then create a function that fetch all the favourited movies 