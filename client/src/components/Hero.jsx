import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
    const navigate = useNavigate()
    return (

        <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen'>

            <div className='text-center mb-6'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'>Create amazing content <br />with <span className='text-primary'>AI tools</span></h1>
                <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>Transform your content creation with our suite of premium AI tools.Write articles,generate images, and enhance your workflow.</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 mt-10 text-center px-4">
                {/* Call to Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
                    <button
                        onClick={() => navigate('/ai')}
                        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-all"
                    >
                        Start Creating Now
                    </button>
                    <button
                        className="border border-gray-300 px-6 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-all"
                    >
                        Watch Demo
                    </button>
                </div>

                {/* Trusted by Section */}
                <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                    <img src={assets.user_group} alt="Trusted Users" className=" h-8 " />
                    <span>Trusted by <strong>10k+</strong> people</span>
                </div>
            </div>


        </div>
    )
}

export default Hero