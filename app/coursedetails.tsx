import ParallaxScrollView from '@/components/ParallaxScrollView'
import { password, username } from '@/components/utils/apikeys'
import { Course, CuriculumItem, Review } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { Pressable } from 'react-native'
import { Image, Text } from 'react-native'
import { View } from 'react-native'

const fetchCourseDetail = async (courseId : string): Promise<Course> =>{
    const response = await axios.get<Course>(`https://www.udemy.com/api-2.0/courses/${courseId}`, {
      auth : {
        username : username,
        password : password,
      }
    })
    return response.data;
}

const fetchCourseCurriculum = async (courseId : string, page: number=1): Promise<CuriculumItem> =>{
    const response = await axios.get<CuriculumItem>(`https://www.udemy.com/api-2.0/courses/${courseId}/public-curriculum-items/?page=${page}`, {
      auth : {
        username : username,
        password : password,
      }
    })
    return response.data;
}

const fetchCourseReviews = async (courseId : string): Promise<Course> =>{
    const response = await axios.get<Course>(`https://www.udemy.com/api-2.0/courses/${courseId}/reviews/`, {
      auth : {
        username : username,
        password : password,
      }
    })
    return response.data;
}


const SegmentedControl: React.FC<{
    selectedSegment: 'curriculum' | 'reviews';
    onSegmentChange: (segment: 'curriculum' | 'reviews') => void;
  }> = ({ selectedSegment, onSegmentChange }) => {
    return (
      <View className='flex-row mb-4 bg-gray-200 rounded-lg p-1 mt-6 z-40'>
        <Pressable 
            onPress={()=> onSegmentChange('curriculum')}
            className={`flex-1 py-4 rounded-md  ${selectedSegment === 'curriculum' ? 'bg-blue-700' : 'bg-transparent'}`}>
            <Text 
                className={`text-center ${selectedSegment === 'curriculum' ? 'text-white' : 'text-neutral-800'}`}
                style={{
                    fontFamily: selectedSegment === 'curriculum' ? 'BarlowBold' : 'BarlowRegular'
                }}
            >Curiculum</Text>
        </Pressable>

        <Pressable 
            onPress={()=> onSegmentChange('reviews')}
            className={`flex-1 py-4 rounded-md ${selectedSegment === 'reviews' ? 'bg-blue-700' : 'bg-transparent'}`}>
            <Text 
                className={`text-center ${selectedSegment === 'reviews' ? 'text-white' : 'text-neutral-800'}`}
                style={{
                    fontFamily: selectedSegment === 'reviews' ? 'BarlowBold' : 'BarlowRegular'
                }}
            >Reviews</Text>
        </Pressable>
      </View>
    );
  };
  

const Coursedetails = () => {

    const { courseId } = useLocalSearchParams<{courseId : string}>();
    const [selectedSegment, setSelectedSegment] = useState<'reviews' | 'curriculum'>('curriculum')
    const [curriculumPage, setCurriculumPage] = useState(1)

    const {data, error, isLoading, refetch} = useQuery<Course>({
        queryKey: ['courseId', courseId],
        queryFn: () => fetchCourseDetail(courseId || ''),
        enabled : true,
    }) 



    const {data: curriculumData, error:curriculumDataError, isLoading:curriculumDataLoading, isFetching:curriculumDataFetching} = useQuery<CuriculumItem>({
        queryKey: ['coursecurriculum', courseId, curriculumPage],
        queryFn: () => fetchCourseCurriculum(courseId || '', curriculumPage),
        enabled : !!courseId,
        keepPreviousData: true,
    }) 


    const {data: reviews, error: reviewsError, isLoading:reviewsLoading} = useQuery({
        queryKey: ['coursereviews', courseId],
        queryFn: () => fetchCourseReviews(courseId || ''),
        enabled : !!courseId,
    }) 


    console.log('These are reviews', reviews);
    
    

    const renderReviewsItem: ListRenderItem <Review> = ({ item }) => (
        <View key={item.id} className='mb-4 border-t border-neutral-300 round-lg'>
            <View className='flex-row justify-between items-center mb-2'>
                <Text className='text-lg'>{item.user?.display_name}</Text>
            </View>

            <Text className='text-neutral-500 text-sm'>
                {new Date(item.created).toLocaleDateString()}
            </Text>

            <Text className='text-neutral-500 text-sm'>Rating: {item.rating}</Text>

            {item.content ? 
                <Text className='text-neutral-400 mt-2 capitalize'>{item.content}</Text>
                 : 
                <Text className='text-neutral-500 text-sm'>No content provided.</Text>
            }
        </View>
    )
    
  return (
    <ParallaxScrollView 
        headerBackgroundColor={{light :'#D0D0D0', dark :'#353636'}}
        headerImage={
            <Image 
                source={{
                    uri: data?.image_480x270,
                }}
                className='w-full h-72 rounded-lg'
            />
        }
    >
        <View className=''>
            <View className='bg-blue-700 rounded-lg py-1 mb-4 w-32 justify-center items-center'>
                <Text className='text-white text-sm' style={{fontFamily : 'BarlowSemiBold'}}>{data?.locale.title}</Text>
            </View>

            <Text className='text-black text-2xl mb-5' 
                style={{fontFamily : 'BarlowBold'}}>{data?.title}
            </Text>

            <View className='flex-row items-center gap-3'>
                <Image source={{uri : data?.visible_instructors[0]?.image_100x100}}
                className='w-10 h-10 rounded-full bg-neutral-200'
                />

                <Text className='text-black text-base w-[95%] ' 
                    style={{fontFamily : 'BarlowRegular'}}>
                    {data?.visible_instructors[0]?.display_name}, {data?.visible_instructors[0]?.job_title}
                </Text>
            </View>

            <Text className='text-black text-2xl mt-5' 
                style={{fontFamily : 'BarlowBold'}}>
                {data?.is_paid ? data?.price : 'Free'}
            </Text>


            <SegmentedControl selectedSegment={selectedSegment} onSegmentChange={setSelectedSegment}/>
            
            {selectedSegment === 'reviews' ? 
            <View className='pb-10'>
                <Text className='text-lg pb-4' style={{fontFamily : 'BarlowBold'}}>Course Reviews</Text>
                <FlatList
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    // data={reviews?.results}
                    data={reviews?.results.slice(0, 5)}
                    renderItem={renderReviewsItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View> : 
            <>
                <Text className='text-lg pb-4' style={{fontFamily : 'BarlowBold'}}>Course Curriculum</Text>
            </>}
        </View>
    </ParallaxScrollView>
  )
}

export default Coursedetails
