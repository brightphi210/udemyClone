import React, { useRef } from 'react'
import { Text, View, Image} from 'react-native'
import Animated, {FadeInDown} from 'react-native-reanimated'
import {router} from 'expo-router'
import LottieView from 'lottie-react-native';
import Button from '@/components/Button'


const Welcome = () => {

    const animation = useRef<LottieView>(null);
  return (
    <View className='bg-white gap-4 p-4 flex-1 w-full items-center justify-center'>

        <Animated.View className='w-full justify-center items-center '
            entering={FadeInDown.duration(300).springify()}
        >
           <Image 
            className=''
            source={require('../assets/animations/Animation - 1727628608416.gif')}
           />
        </Animated.View>


        <Animated.View className='w-full mt-10'
            entering={FadeInDown.duration(300).delay(200).springify()}
        >
            <Text 
                className='text-4xl text-center leading-[3rem] px-10'
                style={{fontFamily: 'BarlowBold'}}
                >Discover and improve your skills.
            </Text>
        </Animated.View>

        <Animated.View className='w-full'
            entering={FadeInDown.duration(300).delay(400).springify()}
        >
            <Text 
                className='text-xl text-center leading-[2rem]'
                style={{fontFamily: 'BarlowRegular'}}
                >Learn from the best courses & tutorials 🚀.
            </Text>
        </Animated.View>

        {/* Button*/}
        <Animated.View className='w-full justify-center items-center mt-8'
            entering={FadeInDown.duration(300).delay(600).springify()}
        >
            <Button title='Get Started' action={()=>router.push('/(tabs)')}/>
        </Animated.View>
    </View>
  )
}

export default Welcome
