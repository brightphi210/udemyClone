import { useWishListStore } from '@/store/wishlistStore';
import { Course } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router'

interface CourseItemProp {
    course: Course;
    customStyles?: string;
    index: number;
}

const CourseItem: React.FC<CourseItemProp> = ({course , customStyles, index}) => {
    
    const {addToWishList, removeFromWishList, isInWishList} = useWishListStore()

    const isInWishListed = isInWishList(course.id)

    const toggleWishList = () =>{
        if(isInWishListed){
            removeFromWishList(course.id)
        }else{
            addToWishList(course)
        }
    }
  return (
    <Pressable className={`pt-4 ${customStyles ? customStyles : ''}`} onPress={()=>router.push({
        pathname: '/coursedetails',
        params: { courseId: course.id },
    })}>
        <Animated.View 
            className={'gap-2 w-full border border-gray-300 overflow-hidden rounded-2xl'}
            entering={FadeInDown.duration(100).delay(index * 300).springify()}
        >
        <Image source={{
            uri: course.image_480x270,
          }}  
          className='w-full h-40'
          
        />

          <View className='px-4 p-2'>
            <Text style={{fontFamily : 'BarlowBold'}} className='text-lg min-h-16 '>{course.title}</Text>
            <View className='flex-row items-center pt-2 pb-4 justify-between'>
                <Text>{course.is_paid ? `${course.price}` : 'Free'}</Text>

                <Pressable onPress={toggleWishList}>
                    <Ionicons color={`${isInWishListed ? 'green' : 'gray'}`}
                        name={`${isInWishListed ? 'heart' : 'heart-outline'}`}
                        size={24}
                    >
                    </Ionicons>
                </Pressable>
            </View>
          </View>
        </Animated.View>
    </Pressable>
  )
}

export default CourseItem
