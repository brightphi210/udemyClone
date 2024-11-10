import { HelloWave } from '@/components/HelloWave';
import Ionicons from '@expo/vector-icons/Ionicons';
import {View, Text, Pressable, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router'
import React, { useState } from 'react';
import axios from 'axios';
import { password, username } from '@/components/utils/apikeys';
import { useQuery } from '@tanstack/react-query';
import CourseItem from '@/components/CourseItem';


  interface Course {
    id : number;
    title : string;
    subtitle : string;
    description : string;
    image : string;
    is_paid : boolean;
    price : number;
    num_reviews : number;
  }


  interface SearchResponse {
    results : Course[];
  }

  interface Category{
    id : string;
    name : string;
    icon : string;
  }

  const categories : Category[] = [
    {id : 'business', name : 'Business', icon : 'briefcase'},
    {id : 'tech', name : 'Tech', icon : 'code'},
    {id : 'design', name : 'Design', icon : 'color-palette'},
    {id : 'marketing', name : 'Marketing', icon : 'megaphone'},
    {id : 'health', name : 'Health', icon : 'fitness'},
    {id : 'music', name : 'Music', icon : 'musical-note'},
    {id : 'lifestyle', name : 'Lifestyle', icon : 'heart'},
  ]


  const fetchCourses = async (searchTearm : string): Promise<SearchResponse> =>{
    const response = await axios.get(`https://www.udemy.com/api-2.0/courses/`, {
      params : {
        search : searchTearm,
      },

      auth : {
        username : username,
        password : password,
        
      }
    })

    return response.data;
  }


  const fetchRecommendedCourses = async (): Promise<SearchResponse> =>{
    const response = await axios.get(`https://www.udemy.com/api-2.0/courses/`, {
      auth : {
        username : username,
        password : password,
      }
    })

    return response.data;
  }

export default function HomeScreen() {

  const [selectedCategory, setSelectedCategory] = useState('business')
  const {data, error, isLoading, refetch} = useQuery({
    queryKey: ['searchCourses', selectedCategory],
    queryFn: () => fetchCourses(selectedCategory),
    enabled : true,
  })
  

  const {
    data : recommendedCourse, 
    error : recommendedError, 
    isLoading : recommendedLoading} = useQuery({
    queryKey: ['recommendedcourses'],
    queryFn: () => fetchRecommendedCourses(),
  })
  
  //Render Category
  const renderCategory = ({ item } : {item : Category}) =>(
      <Pressable
        className='mr-4 p-2 rounded-full items-center flex-col gap-4'
        onPress={()=> setSelectedCategory(item.id)}
      >
        <View className={`p-4 rounded-full flex flex-row items-center 
          ${selectedCategory === item.id  ? 'border-2 border-blue-700' : 'border border-gray-400'}`}>
            <Ionicons name={item.icon as any} size={25} color={selectedCategory === item.id ? '#1d4ed8' : 'gray'} />
        </View>
          <Text className='text-black text-lg' style={{
            fontFamily : selectedCategory === item.id ? 'BarlowBold' : 'BarlowRegular'
          }}>{item.name}</Text>
      </Pressable>
  )


  return (
    <View className='bg-white flex-1'>
      
      {/* greetings */}
      <View className='pt-16 pb-6 px-6 bg-[#2563eb]'>

        <Animated.View
          className='flex-row justify-between items-center'
        >
          <View >

            <View className='flex-row items-end gap-2'>
              <Text className='text-white text-lg'
              style={{fontFamily : 'BarlowSemiBold'}}
              >Good Morning</Text>
              <View>
                <HelloWave />
              </View>
            </View>

            <Text className='text-white text-2xl'
            style={{fontFamily : 'BarlowBold'}}
            >Bright Philip</Text>
          </View>


          <View 
            className='bg-blue-700 p-2 justify-center items-center rounded-full'>
            <Ionicons name='notifications-outline' 
            size={25}
            color={'white'}
            />
          </View>
        </Animated.View>

        {/* search area  */}
        <Pressable onPress={()=>router.push('/explore')}>
          <View 
            className='flex-row items-center gap-2 p-4 mt-4 bg-white rounded-2xl'
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
            >
            <Ionicons name='search-outline' size={25} color={'white'} />
            <Text className='text-sm text-white' 
            style={{ fontFamily : 'BarlowRegular'}}
            >
              What do you want to learn ?</Text>
          </View>
        </Pressable>
        
      </View>

      {/* category  */}
      <ScrollView className='flex-1 bg-white gap-4'>
        <Animated.View className={'gap-6'} entering={FadeInDown.duration(500).springify()}>
          <View className='flex-row justify-between px-6 pt-4 items-center'>
            <Text className='text-xl ' 
              style={{ fontFamily : 'BarlowSemiBold'}}
              >Explore Topics
            </Text>

            <Text className='text-lg text-blue-700 ' 
              style={{ fontFamily : 'BarlowSemiBold'}}
              >See more
            </Text>
          </View>

          {/* category list */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
          className='mb-4 pl-4'
          >
          {categories.map((category)=>(
            <View key={category.id}>{renderCategory({item : category})}</View>
          ))}
          </ScrollView>
        </Animated.View>

        {/* Category  courses */}
        {
          isLoading ? <View className='flex justify-center items-center'>
            <ActivityIndicator size={'large'} color={'#2563eb'} />
          </View> : error ? (
            <Text> Error {(error as Error).message}</Text>
          ): data?.results ? (
            <FlatList 
              horizontal={true}
              data={data.results}
              keyExtractor={(item)=> item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={
                ({item })=>{
                  return (
                    <CourseItem 
                      course={item} 
                      key={item.id} 
                      customStyles='w-[22rem] pl-6'
                    />
                  )
                }
              }
            />
          ): (
            <View className='flex-1 justify-center items-center'>
              <Text>No results Found</Text>
            </View>
          )
        }



        {/* Recomemded Courses  */}

        <View className='pt-6'>
          <View className='mt-4 px-6 bg-white rounded-2xl' style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
            <Text className='text-xl ' style={{ fontFamily : 'BarlowBold'}}>
              Recommended Courses
            </Text>
          </View>

          {recommendedLoading ? 
            <View className='flex-1 justify-center items-center pt-6'>
              <ActivityIndicator size={'large'} color={'#2563eb'} />
            </View> : 
            recommendedError ? (
              <Text> Error {(recommendedError as Error).message}</Text>
            ): recommendedCourse?.results ? (
              <FlatList 
                horizontal={true}
                data={recommendedCourse?.results}
                keyExtractor={(item)=> item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={
                  ({item })=>{
                    return (
                      <CourseItem 
                        course={item} 
                        key={item.id} 
                        customStyles='w-[22rem] pl-6'
                      />
                    )
                  }
                }
              />
            ): (
              <View className='flex-1 justify-center items-center'>
                <Text>No results Found</Text>
              </View>
            )
          }
        </View>


      </ScrollView>
    </View>
  );
}
