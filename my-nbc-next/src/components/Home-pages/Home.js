import React from 'react'
import OurHeros from './homePage components/OurHeros'
import About from './homePage components/About'
import WhatWeDo from './homePage components/WhatWeDo'
import OurCausesSection from './homePage components/OurCausesSection'
import WhyChooseUs from './homePage components/WhyChooseUs'
import OurProgram from './homePage components/OurProgram'
import ScrollingTicker from './homePage components/ScrollingTicker'
import OurFeatures from './homePage components/OurFeatures'
import ContactUs from './homePage components/ContactUs'
import HowItWorks from './homePage components/HowItWorks'
import Testimonials from './homePage components/Testimonials'
import Gallery from './homePage components/Gallery'
import BlogSection from './homePage components/BlogSection'
// import MembersCountSection from './homePage components/MembersCountSection'

const Home = () => {
    return (
        <>
            <OurHeros />
            <About />    
            <WhatWeDo />
            <OurCausesSection />
            <WhyChooseUs />
            <OurProgram />
            <ScrollingTicker />
            <OurFeatures />
            <ContactUs />
            <HowItWorks />
            <Testimonials />
            <Gallery />
            <BlogSection /> 
        </>

    )
}

export default Home