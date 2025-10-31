import { Edit, Eraser, Hash, Image, Sparkle, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
const Removebackground = () => {



  const [input, setinput] = useState('')
  const [publish,setpublish] = useState(false)
  const [loading,setloading] = useState(false)
  const [content,setcontent] = useState('')
  const { getToken } = useAuth()

  const onsubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setloading(true)
      const formData = new FormData()
      formData.append('image', input)
      const { data } = await axios.post('/api/ai/remove-image-background', formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          
        }
      })
      if (data.success) {
        setcontent(data.content)
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)

    }
    setloading(false)
  }
 return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left column */}
      <form action="" className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200' onSubmit={onsubmitHandler}>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Background Removal</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input accept='image/*' type="file" className='w-full p-2 border border-gray-300 rounded-md' placeholder='Describe what you want to generate' required onChange={(e) => setinput(e.target.files[0])} />

      <p className='mt-6 text-sm font-medium'> Supports</p>
      <p className='text-sm'>JPEG, PNG, WebP, GIF, SVG</p>

       
       

       
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>{
          loading ? <span className='w-4 h-4 my-l rounded-full border-2 border-t-transparent animate-spin'></span> :<Eraser className='w-5' />}Remove background</button>


      </form>

      {/* Right coloumn */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold' >Remove background</h1>
        </div>

        {
          !content?(<div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5
text-gray-400'>
            <Eraser className='w-9 h-9' />
            
            <p>Enter a topic and click "Remove background" to get started</p>
          </div>
        </div>):(
          <img src={content} alt="image" />

        )
        }
        
      </div>

    </div>
  )
}

export default Removebackground