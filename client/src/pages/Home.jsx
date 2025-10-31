import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Plan from '../components/Plan'
import Footer from '../components/Footer'
import Testimonial from '../components/Testimonial'
import AiTools from '../components/AiTools'

const Home = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <AiTools/>
    <Testimonial/>
    <Plan/>
    <Footer/>
    </>
  )
}

export default Home