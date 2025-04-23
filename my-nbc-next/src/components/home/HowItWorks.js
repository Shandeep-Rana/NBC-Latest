'use client';

import React from 'react';
import Image from 'next/image';

const HowItWorks = () => {
    return (
        <div className="how-it-work">
            <div className="container">
                <div className="row section-row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">How it works</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">
                                Step by step working process
                            </h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                Our step-by-step process ensures meaningful change: identifying community needs, designing tailored programs, implementing sustainable solutions.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="how-it-work-list">
                            <div className="how-it-work-item">
                                <div className="how-it-work-image">
                                    <figure className="image-anime reveal">
                                        <Image
                                            src="/images/how-it-work-img-1.jpg"
                                            alt="Healthcare Support"
                                            width={600}  // Specify image dimensions
                                            height={400}  // Specify image dimensions
                                            layout="responsive"
                                        />
                                    </figure>
                                </div>
                                <div className="how-it-work-content wow fadeInUp" data-wow-delay="0.4s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-how-it-work-1.svg"
                                            alt="Icon 1"
                                            width={50}  // Specify icon dimensions
                                            height={50}  // Specify icon dimensions
                                        />
                                    </div>
                                    <div className="how-it-work-body">
                                        <h3>Healthcare Support</h3>
                                        <p>Provide essential healthcare services and resources to communities.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="how-it-work-item">
                                <div className="how-it-work-image">
                                    <figure className="image-anime reveal">
                                        <Image
                                            src="/images/how-it-work-img-2.jpg"
                                            alt="Plan and Design"
                                            width={600}  // Specify image dimensions
                                            height={400}  // Specify image dimensions
                                            layout="responsive"
                                        />
                                    </figure>
                                </div>
                                <div className="how-it-work-content wow fadeInUp" data-wow-delay="0.4s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-how-it-work-2.svg"
                                            alt="Icon 2"
                                            width={50}  // Specify icon dimensions
                                            height={50}  // Specify icon dimensions
                                        />
                                    </div>
                                    <div className="how-it-work-body">
                                        <h3>Plan and Design</h3>
                                        <p>Design solutions tailored to the needs identified in the community.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="how-it-work-item">
                                <div className="how-it-work-image">
                                    <figure className="image-anime reveal">
                                        <Image
                                            src="/images/how-it-work-img-3.jpg"
                                            alt="Implement Solutions"
                                            width={600}  // Specify image dimensions
                                            height={400}  // Specify image dimensions
                                            layout="responsive"
                                        />
                                    </figure>
                                </div>
                                <div className="how-it-work-content wow fadeInUp" data-wow-delay="0.6s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-how-it-work-3.svg"
                                            alt="Icon 3"
                                            width={50}  // Specify icon dimensions
                                            height={50}  // Specify icon dimensions
                                        />
                                    </div>
                                    <div className="how-it-work-body">
                                        <h3>Implement Solutions</h3>
                                        <p>Roll out the solutions and initiatives in the field effectively.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="how-it-work-item">
                                <div className="how-it-work-image">
                                    <figure className="image-anime reveal">
                                        <Image
                                            src="/images/how-it-work-img-4.jpg"
                                            alt="Report and Share"
                                            width={600}  // Specify image dimensions
                                            height={400}  // Specify image dimensions
                                            layout="responsive"
                                        />
                                    </figure>
                                </div>
                                <div className="how-it-work-content wow fadeInUp" data-wow-delay="0.6s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-how-it-work-4.svg"
                                            alt="Icon 4"
                                            width={50}  // Specify icon dimensions
                                            height={50}  // Specify icon dimensions
                                        />
                                    </div>
                                    <div className="how-it-work-body">
                                        <h3>Report and Share</h3>
                                        <p>Measure impact, report outcomes, and share the stories that matter.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-12">
                        <div className="section-footer-text how-work-footer-text wow fadeInUp" data-wow-delay="0.8s">
                            <p>
                                Help Our Kids with Education, Food, Health Support.{' '}
                                <a href="#">Contact us</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
