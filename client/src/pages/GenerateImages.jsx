import { Edit, Hash, Image, Sparkle, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const GenerateImages = () => {

  const imagestyle = [
    'Realistic', 'Ghibli style', 'Cartoon style', 'Anime style', 'Portrait style'




  ]

  const [selectedStyle, setselectedStyle] = useState('Realistic')
  const [input, setinput] = useState('')
  const [publish, setpublish] = useState(false)
  //after server
  const [loading, setloading] = useState(false)
  const [content, setcontent] = useState('')

  const { getToken } = useAuth()






  const onsubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setloading(true)
      const prompt = `Generate an image about ${input} in ${selectedStyle} style`
      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
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
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        <textarea value={input} type="text" className='w-full p-2 border border-gray-300 rounded-md' placeholder='Describe what you want to generate' required onChange={(e) => setinput(e.target.value)} />


        <p className='mt-6 text-sm font-medium'>Category</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>

          {imagestyle.map((item) => {
            return (
              <span key={item} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? 'bg-[#4A7AFF] text-white' : ''}`} onClick={() => setselectedStyle(item)}>{item}</span>

            )
          })}

        </div>
        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setpublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image Public</p>
        </div>


        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>{
          loading ? <span className='w-4 h-4 my-l rounded-full border-2 border-t-transparent animate-spin'></span> : <Edit className='w-5' />} Generate Image</button>


      </form>

      {/* Right coloumn */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold' >Generated image</h1>
        </div>
        {
          !content ? (<div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5
text-gray-400'>
              <Image className='w-9 h-9' />

              <p>Enter a topic and click "Generate Image" to get started</p>
            </div>
          </div>) : (
            <div className='mt-3 h-full'>
              <img src={content} alt="image" className='w-full h-full' />
            </div>
          )
        }

      </div>

    </div>
  )
}

export default GenerateImages