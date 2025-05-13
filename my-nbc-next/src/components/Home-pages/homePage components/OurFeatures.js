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
                            <h2 className="text-anime-style-2" data-cursor="-opaque">Highlights our impactful work</h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                Discover the positive change we&apos;ve created through our programs, partnerships, and dedicated efforts.
                                From healthcare and education to environmental sustainability.
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
                                        <Image src="/images/our-features-img-1.jpg" alt="Healthcare Support" width={600} height={400} />
                                    </figure>
                                </div>
                                <div className="our-features-content">
                                    <div className="our-features-body">
                                        <h2><span className="counter">96</span>%</h2>
                                        <h3>healthcare support</h3>
                                        <p>Provide essential healthcare services and resources to communities.</p>
                                    </div>
                                    <div className="icon-box">
                                        <Image src="/images/icon-our-features-1.svg" alt="Healthcare Icon" width={40} height={40} />
                                    </div>
                                </div>
                            </div>
                            <div className="our-features-item">
                                <div className="our-features-image">
                                    <figure className="image-anime reveal">
                                        <Image src="/images/our-features-img-2.jpg" alt="Education Support" width={600} height={400} />
                                    </figure>
                                </div>

                                <div className="our-features-content">
                                    <div className="our-features-body">
                                        <h2><span className="counter">94</span>%</h2>
                                        <h3>education support</h3>
                                        <p>Provide essential healthcare services and resources to communities.</p>
                                    </div>
                                    <div className="icon-box">
                                        <Image src="/images/icon-our-features-2.svg" alt="Education Icon" width={40} height={40} />
                                    </div>
                                </div>
                            </div>
                            <div className="our-features-item">
                                <div className="our-features-image">
                                    <figure className="image-anime reveal">
                                        <Image src="/images/our-features-img-3.jpg" alt="Food Support" width={600} height={400} />
                                    </figure>
                                </div>

                                <div className="our-features-content">
                                    <div className="our-features-body">
                                        <h2><span className="counter">95</span>%</h2>
                                        <h3>food support</h3>
                                        <p>Provide essential healthcare services and resources to communities.</p>
                                    </div>
                                    <div className="icon-box">
                                        <Image src="/images/icon-our-features-3.svg" alt="Food Icon" width={40} height={40} />
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
