
import React from 'react'
import { Pressable, Text } from 'react-native'

interface ButtonProps {
    title : string;
    action?: () => void;
}

const Button : React.FC<ButtonProps> = ({title, action} : ButtonProps) => {
    return (
      <Pressable onPress={action} className='bg-blue-700 rounded-2xl justify-center items-center py-4 w-3/5'>
        <Text className='text-white font-bold text-lg'>{title}</Text>
      </Pressable>
    )
}

export default Button