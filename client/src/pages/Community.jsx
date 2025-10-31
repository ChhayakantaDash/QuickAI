import React, { useEffect, useState } from 'react'
import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const [loading, setloading] = useState(true)
  const { getToken } = useAuth()

  const fetchcreations = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creation', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      // console.log(data);
      // console.log(data.creations);




      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    finally {
    setloading(false) // ensures it only happens after try/catch finishes
  }
  }

  const imageLikeToggle = async (id) => {
  try {
    const { data } = await axios.post(
      '/api/user/toggle-like-creation',
      { id },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      }
    )

    if (data.success) {
      toast.success(data.message)
      await fetchcreations()
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}


  useEffect(() => {
    fetchcreations()
  }, [])

  return !loading?(
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-lg font-semibold">Creations</h2>

      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
       {creations
  .filter((creation) => creation.type === 'image' && creation.publish===true)
  .map((creation, index) => (
    <div
      key={index}
      className="relative group inline-block pl-3 pt-3 w-full sm:w-1/2 lg:w-1/3"
    >
      <img
        src={encodeURI(creation.content)}
        alt={creation.prompt || 'Generated creation'}
        className="w-full h-auto rounded-lg object-contain"
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
        <p className="text-sm hidden group-hover:block">{creation.prompt}</p>
        <div className="flex gap-1 items-center">
          <p>{creation.likes.length}</p>
          <Heart
          onClick={()=>imageLikeToggle(creation.id)}
            className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
              creation.likes.includes(user.id)
                ? 'fill-red-500 text-red-600'
                : 'text-white'
            }`}
          />
        </div>
      </div>
    </div>
  ))}

      </div>
    </div>
  ):(
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community
