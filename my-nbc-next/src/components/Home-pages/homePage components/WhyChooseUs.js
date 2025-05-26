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
                                    We are proud to be the best volunteering portal for you – whether you&apos;re a student, professional, or someone simply looking to give back to society.
                                </p>
                            </div>
                            <div className="why-choose-list wow fadeInUp" data-wow-delay="0.4s">
                                <ul>
                                    <li>Volunteer Opportunities</li>
                                    <li>Flexible & Impactful</li>
                                    <li>Empowerment through partner</li>
                                    <li>Recognition & Community</li>
                                </ul>
                            </div>
                            <div className="why-choose-counters">
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">5</span>+</h2>
                                    <p>Years of experience</p>
                                </div>
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">200</span>+</h2>
                                    <p> volunteers</p>
                                </div>
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">50</span>+</h2>
                                    <p>Life Saving Events</p>
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
