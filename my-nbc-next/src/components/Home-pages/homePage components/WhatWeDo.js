'use client';
import React from 'react';
import Image from 'next/image';

const WhatWeDo = () => {
    return (
        <div className="what-we-do">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="what-we-do-content">
                            <div className="section-title">
                                <h3 className="wow fadeInUp">what we do</h3>
                                <h2 className="text-anime-style-2" data-cursor="-opaque">
                                    Building hope creating lasting change
                                </h2>
                            </div>

                            <div className="what-we-list">
                                <div className="what-we-item wow fadeInUp" data-wow-delay="0.2s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-what-we-1.svg"
                                            alt="Social Work in Public Health"
                                            width={72}
                                            height={72}
                                        />
                                    </div>
                                    <div className="what-we-item-content">
                                        <h3>Social Work in Public Health</h3>
                                        <p>
                                            We actively promote health awareness by conducting campaigns, organising free check-ups, and running educational drives. Our volunteers play a vital role in making public health resources accessible to all.
                                        </p>
                                    </div>
                                </div>
                                <div className="what-we-item wow fadeInUp" data-wow-delay="0.4s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-what-we-2.svg"
                                            alt="Clean Water"
                                            width={72}
                                            height={72}
                                        />
                                    </div>
                                    <div className="what-we-item-content">
                                        <h3>Blood Donation Camps</h3>
                                        <p>
                                            We organize regular blood donation camps in collaboration with local hospitals and healthcare providers. These camps not only save lives but also bring communities together for a noble cause.
                                        </p>
                                    </div>
                                </div>
                                <div className="what-we-item wow fadeInUp" data-wow-delay="0.6s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-what-we-3.svg"
                                            alt="Community Empowerment & Support"
                                            width={72}
                                            height={72}
                                        />
                                    </div>
                                    <div className="what-we-item-content">
                                        <h3>Community Empowerment & Support</h3>
                                        <p>
                                            We focus on uplifting underprivileged communities through education, skill development workshops, environmental initiatives, and direct support during times of crisis. </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="what-we-do-images">
                            <div className="what-we-do-img-1">
                                <figure className="image-anime reveal">
                                    <Image
                                        src="/images/what-we-do-image-1.jpg"
                                        alt="What We Do Image 1"
                                        width={455}
                                        height={682.5}
                                        priority
                                    />
                                </figure>
                            </div>

                            <div className="what-we-do-img-2">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/what-we-do-image-2.jpg"
                                        alt="What We Do Image 2"
                                        width={350}
                                        height={250}
                                    />
                                </figure>
                            </div>

                            <div className="donate-now-box">
                                <a href="/contact">Contact us</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatWeDo;
