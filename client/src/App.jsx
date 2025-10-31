import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import Dashboard from './pages/Dashboard'
import GenerateImages from './pages/GenerateImages'
import Removebackground from './pages/Removebackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import {Toaster} from 'react-hot-toast'
import Ai from './components/Ai'

function App() {

  // const {getToken}=useAuth()
  // useEffect(()=>{
  //   getToken().then((token)=>{
  //     console.log(token)
  //   })
  // },[])

  return (
    
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<GenerateImages />} />
          <Route path='remove-background' element={<Removebackground />} />
          <Route path='remove-Object' element={<RemoveObject />} />
          <Route path='review-resume' element={<ReviewResume />} />
          <Route path='community' element={<Community />} />
          
        </Route>

      </Routes>
      <Ai/>
    </div>
  )
}

export default App
