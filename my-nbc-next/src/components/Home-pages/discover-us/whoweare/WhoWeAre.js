'use client'
import About from '@/components/Home-pages/homePage components/About'
import OurFeatures from '@/components/Home-pages/homePage components/OurFeatures'
import Link from 'next/link'
import React from 'react'
import HowWeHelpSection from './HowWeHelp'

const WhoWeAre = () => {
  return (
    <>
      <div className="page-header parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque">
                  <span>Who We Are</span>
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      who we are
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <About />
      {/* <HowWeHelpSection/> */}
      {/* <OurFeatures /> */}
    </>
  )
}

export default WhoWeAre;