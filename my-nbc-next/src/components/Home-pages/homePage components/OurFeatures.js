'use client';

import React from 'react';
import Image from 'next/image';

const OurFeatures = () => {
    return (
        <div className="our-features">
            <div className="container">
                <div className="row section-row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">our feature</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">Heres how we&apos;re making a difference</h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                At Nangal By Cycle, we&apos;re not just about rides, we&apos;re about rewriting the story of tourism in Punjab, one pedal at a time.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="our-features-list">

                            <div className="our-features-item">
                                <div className="our-features-image">
                                    <figure className="image-anime reveal">
                                        <Image src="/images/program-1.png" alt="Sustainable Tourism" width={383.28} height={321.95} />
                                    </figure>
                                </div>
                                <div className="our-features-content">
                                    <div className="our-features-body">
                                        <h3>Sustainable Tourism</h3>
                                        <p>We promote eco-friendly travel that treads lightly on the environment. No engines. No emissions. Just fresh air and clean adventures.</p>
                                    </div>
                                    <div className="icon-box">
                                        <Image src="/images/icon-our-features-1.png" alt="Healthcare Icon" width={72} height={72} />
                                    </div>
                                </div>
                            </div>
                            <div className="our-features-item">
                                <div className="our-features-image">
                                    <figure className="image-anime reveal">
                                        <Image src="/images/program-3.jpg" alt="Cultural Revival" width={383.28} height={321.95} />
                                    </figure>
                                </div>

                                <div className="our-features-content">
                                    <div className="our-features-body">
                                        <h3>Cultural Revival</h3>
                                        <p>We spotlight the hidden gems of Nangal&apos;s forgotten trails, untold stories, and the real flavor of Punjab that doesn’t make it into guidebooks.</p>
                                    </div>
                                    <div className="icon-box">
                                        <Image src="/images/icon-our-features-2.png" alt="Education Icon" width={72} height={72} />
                                    </div>
                                </div>
                            </div>
                            <div className="our-features-item">
                                <div className="our-features-image">
                                    <figure className="image-anime reveal">
                                        <Image src="/images/services-image-1.png" alt="Local Empowerment" width={383.28} height={321.95} />
                                    </figure>
                                </div>

                                <div className="our-features-content">
                                    <div className="our-features-body">
                                        <h3>Local Empowerment</h3>
                                        <p>Our rides support local guides, artisans, and farmers. Every tour is a step toward strengthening the community economy and celebrating regional talent.</p>
                                    </div>
                                    <div className="icon-box">
                                        <Image src="/images/icon-our-features-3.png" alt="Food Icon" width={72} height={72} />
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

export default OurFeatures;
