import React from 'react';

const OurHeros = () => {
  return (
    <div className="hero hero-video">
      <div className="hero-bg-video">
        <video autoPlay muted loop id="myVideo">
          <source src="https://demo.awaikenthemes.com/assets/videos/lenity-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="hero-content">
              <div className="section-title">
                <h3 className="wow fadeInUp">Welcome to Nangal By Cycle</h3>
                <h1 className="text-anime-style-2" data-cursor="-opaque"><span>Empowering Communities</span>, Creating Change Together.</h1>
                <p className="wow fadeInUp" data-wow-delay="0.2s">
                  Welcome to www.nangalbycycle.com, your gateway to your community empowerment and support. We are dedicated to fostering a strong sense of community across 100+ villages in our area. Whether you&apos;re seeking volunteer opportunities, looking to contribute as a blood donor, sharing local insights through blogs, or accessing vital services, you&apos;ve come to the right place. Our volunteer platform serves as a central hub for connecting individuals, organizations, and resources to make a positive impact.
                </p>
              </div>
              <div className="hero-body wow fadeInUp" data-wow-delay="0.4s">
                <div className="hero-btn">
                  <a href="#" className="btn-default">Become a Volunteer</a>
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
