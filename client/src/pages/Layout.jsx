import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useUser, SignIn } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const {user}=useUser()

  return user?(
    <div className="flex flex-col h-screen">

      {/* Top Navbar */}
      <nav className="w-full px-8 h-14 flex items-center justify-between border-b border-gray-200">
        <img src={assets.logo} alt="logo" onClick={() => navigate('/')} className="cursor-pointer w-32 sm:w-34" />
        {
          sidebar
            ? <X className="w-6 h-6 text-gray-600 sm:hidden" onClick={() => setSidebar(false)} />
            : <Menu className="w-6 h-6 text-gray-600 sm:hidden" onClick={() => setSidebar(true)} />
        }
      </nav>

      {/* Main Body: Sidebar + Content */}
      <div className="flex flex-1 h-[calc(100vh-56px)]">
        {/* Sidebar (hidden on small, shown on sm and up) */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        {/* Main Content */}
        <div className="flex-1 bg-[#F4F7FB] overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  ):(
    <div className='flex items-center justify-center h-screen'>
      <SignIn/>
    </div>
  )
}

export default Layout
