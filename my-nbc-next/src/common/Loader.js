import React from 'react'
import Image from 'next/image'

const Loader = () => {
  return (
    <div className="preloader">
      <div className="loading-container">
        <div className="loading" />
        <div id="loading-icon">
          <Image src="/images/loader.png" alt="Loading" width={80} height={80} />
        </div>
      </div>
    </div>
  )
}

export default Loader;