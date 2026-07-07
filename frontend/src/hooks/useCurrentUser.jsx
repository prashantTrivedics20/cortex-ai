import React from 'react'
import { useEffect } from 'react'
import api from '../utils/axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/user.slice'

function useCurrentUser() {
    const dispatch=useDispatch()
useEffect(()=>{
console.log('useCurrentUser hook - fetching current user...');
const get=async ()=>{
    try {
        const {data}=await api.get("/api/me")
        console.log('Current user API response:', data);
       dispatch(setUserData(data.user))
    } catch (error) {
        // User is not logged in, which is fine
        if (error?.response?.status === 401) {
            console.log("User not authenticated")
        } else {
            console.error("Error fetching current user:", error)
        }
    }
}
get()
},[])
}

export default useCurrentUser
