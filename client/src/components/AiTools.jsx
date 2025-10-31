import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Gem, Sparkle } from 'lucide-react'

const AiTools = () => {
    const navigate = useNavigate()
    const { user } = useUser()

    return (
        <div className='px-4 sm:px-20 xl:px-32 my-24'>

            <div className=' text-center'>

                <h2 className='text-slate-700 text-[42px] font-semibold'>Powerful AI Tools</h2>
                <p className='text-gray-700 text-[20px] max-w-lg mx-auto'>Everthing you need to create,enhance, and optimize your content with cutting-edge AI technology</p>

            </div>

            <div className='flex flex-wrap mt-10 justify-center'>
                {AiToolsData.map((tool, index) => (
                    <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer' onClick={() => user && navigate(tool.path)}>
                        <tool.Icon className='w-12 h-12 p-3 text-white rounded-xl' style={{ background: `linear-gradient(to bottom ,${tool.bg.from},${tool.bg.to})` }} />
                        <h3 className='text-slate-700 text-[20px] font-semibold mt-4'>{tool.title}</h3>
                        <p className='text-gray-700 text-[16px]'>{tool.description}</p>


                    </div>

                ))}
            </div>
        </div>
    )
}

export default AiTools