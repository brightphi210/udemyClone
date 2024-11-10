import { create } from 'zustand'
import { Course } from '@/types/types'

interface WishListState {
    wishList : Course[];
    addToWishList : (course : Course) => void;
    removeFromWishList : (courseId : number) => void;
    isInWishList : (courseId:number) =>boolean;
}

export const useWishListStore = create<WishListState>((set, get)=>({
    wishList : [],
    addToWishList : (course) => set((state)=>({wishList : [...state.wishList, course]})),
    removeFromWishList : (courseId) => set((state)=>({wishList : state.wishList.filter((c) => c.id!== courseId)})),
    isInWishList : (courseId) => get().wishList.some((c) => c.id === courseId)
}))