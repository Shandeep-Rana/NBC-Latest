'use client';

import React from 'react';
import Image from 'next/image';

const WhyChooseUs = () => {
    return (
        <div className="why-choose-us">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="why-choose-images">
                            <div className="why-choose-image-1">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/why-choose-img-1.jpg"
                                        alt="Why Choose Image 1"
                                        width={500}
                                        height={400}
                                        layout="responsive"
                                    />
                                </figure>
                            </div>
                            <div className="why-choose-image-2">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/why-choose-img-2.jpg"
                                        alt="Why Choose Image 2"
                                        width={500}
                                        height={400}
                                        layout="responsive"
                                    />
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="why-choose-content">
                            <div className="section-title">
                                <h3 className="wow fadeInUp">why choose us</h3>
                                <h2 className="text-anime-style-2" data-cursor="-opaque">Why we stand out together</h2>
                                <p className="wow fadeInUp" data-wow-delay="0.2s">
                                    Our dedication, transparency, and community-driven approach set us apart. Partnering with us creates programs that create meaningful change.
                                </p>
                            </div>
                            <div className="why-choose-list wow fadeInUp" data-wow-delay="0.4s">
                                <ul>
                                    <li>Community-centered approach</li>
                                    <li>Transparency and accountability</li>
                                    <li>Empowerment through partnerships</li>
                                    <li>Volunteer and donor engagement</li>
                                </ul>
                            </div>
                            <div className="why-choose-counters">
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">25</span>+</h2>
                                    <p>Years of experience</p>
                                </div>
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">230</span>+</h2>
                                    <p>Thousands of volunteers</p>
                                </div>
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">400</span>+</h2>
                                    <p>Worldwide offices</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;
