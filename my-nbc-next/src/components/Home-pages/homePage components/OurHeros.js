import Link from 'next/link';
import React from 'react';

const OurHeros = () => {
  return (
    <div className="hero hero-video">
      <div className="hero-bg-video">
        <video autoPlay muted loop id="myVideo">
          <source src="/images/lv_0_20250702170949.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="hero-content">
              <div className="section-title">
                <h3 className="wow fadeInUp">Welcome to Nangal By Cycle (NBC) </h3>
                <h1 className="text-anime-style-2" data-cursor="-opaque"><span>Empowering Communities</span>, Creating Change Together.</h1>
                <p className="wow fadeInUp" data-wow-delay="0.2s">
                  At Nangal By Cycle, we are building movement across 100+ villages to promote health, sports , active lifestyle, volunteerism, environmental awareness, and social unity. Whether you want to volunteer, register as a blood donor, share local stories through blogs, or access essential community services — Nangal By Cycle is your gateway to connect, contribute, and create lasting impact.
                </p>
              </div>
              <div className="hero-body wow fadeInUp" data-wow-delay="0.4s">
                <div className="hero-btn">
                  <Link href='/auth/register' className="btn-default">Become a Volunteer</Link>
                </div>
                <div className="video-play-button">
                  <p>Play video</p>
                  <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" className="popup-video" data-cursor-text="Play">
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurHeros;
