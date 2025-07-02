'use client';
import React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <div className="about-us">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side Images */}
          <div className="col-lg-6">
            <div className="about-us-images">
              <div className="about-img-1">
                <figure className="image-anime">
                  <Image
                    src="/images/about-img-1.jpg"
                    alt="About Image 1"
                    width={480}
                    height={456}
                    priority
                  />
                </figure>
              </div>

              <div className="about-img-2">
                <figure className="image-anime">
                  <Image
                    src="/images/about-img-2.jpg"
                    alt="About Image 2"
                    width={382}
                    height={328.52}
                    priority
                  />
                </figure>
              </div>

              <div className="need-fund-box">
                <Image src="/images/blood-donation1.png"
                  width={60}
                  height={60} alt="" />
                <p>Be a hero <span ></span></p>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="col-lg-6">
            <div className="about-us-content">
              <div className="section-title">
                <h3 className="wow fadeInUp">about us</h3>
                <h2 className="text-anime-style-2" data-cursor="-opaque">A Journey of Miles, A Movement of Minds</h2>
                <p className="wow fadeInUp" data-wow-delay="0.2s">We are a group of citizens and changemakers who believe that real transformation begins at the grassroots. Through eco-friendly initiatives, public health campaigns, and community-driven efforts, Nangal By Cycle brings people together to create meaningful societal change.</p>
              </div>

              <div className="about-us-body">
                <div className="about-us-body-content">
                  <div className="about-support-box wow fadeInUp" data-wow-delay="0.4s">
                    <div className="icon-box">
                      <Image
                        src="/images/icon-about-support.svg"
                        alt="Support Icon"
                        width={50}
                        height={50}
                      />
                    </div>

                    <div className="about-support-content">
                      <h3>Volunteer Opportunities</h3>
                      <p>Join NBC as a volunteer and be a part of life-saving events that make a real difference in your community.</p>
                    </div>
                  </div>

                  <div className="about-btn wow fadeInUp" data-wow-delay="0.6s">
                    {/* <a href="about.html" className="btn-default">
                      about us
                    </a> */}
                  </div>
                </div>

                <div className="helped-fund-item">
                  <div className="helped-fund-img">
                    <figure className="image-anime">
                      <Image
                        src="/images/helped-fund-img.jpg"
                        alt="Helped Fund"
                        width={120}
                        height={120}
                      />
                    </figure>
                  </div>
                  <div className="helped-fund-content">
                    <h3>
                      <span className="counter">We&#39;re trusted</span> 
                    </h3>
                    <br />
                    <p>
                      NBC – Trusted since 2024, leading impactful initiatives such as blood donation camps and cycling awareness events to promote an active lifestyle and spread anti-drug awareness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
