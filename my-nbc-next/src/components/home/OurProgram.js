'use client';
import React from 'react';
import Image from 'next/image';

const OurProgram = () => {
    return (
        <div className="our-program">
            <div className="container">
                <div className="row section-row align-items-center">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">our program</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">Empowering our programs</h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                Our programs are designed to create sustainable change by addressing community needs, empowering individuals, long-term development through education.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="program-item wow fadeInUp">
                            <div className="program-image">
                                <a href="program-single.html" data-cursor-text="View">
                                    <figure className="image-anime">
                                        <Image
                                            src="/images/program-1.jpg"
                                            alt="Women's empowerment"
                                            width={500}
                                            height={300}
                                        />
                                    </figure>
                                </a>
                            </div>
                            <div className="program-body">
                                <div className="program-content">
                                    <h3><a href="program-single.html">Women's empowerment</a></h3>
                                    <p>Providing resources, education, and advocacy for women's rights.</p>
                                </div>
                                <div className="program-button">
                                    <a href="program-single.html" className="readmore-btn">read more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="program-item wow fadeInUp" data-wow-delay="0.2s">
                            <div className="program-image">
                                <a href="program-single.html" data-cursor-text="View">
                                    <figure className="image-anime">
                                        <Image
                                            src="/images/program-2.jpg"
                                            alt="Housing assistance"
                                            width={500}
                                            height={300}
                                        />
                                    </figure>
                                </a>
                            </div>
                            <div className="program-body">
                                <div className="program-content">
                                    <h3><a href="program-single.html">Housing assistance</a></h3>
                                    <p>Providing resources, education, and advocacy for women's rights.</p>
                                </div>
                                <div className="program-button">
                                    <a href="program-single.html" className="readmore-btn">read more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="program-item wow fadeInUp" data-wow-delay="0.4s">
                            <div className="program-image">
                                <a href="program-single.html" data-cursor-text="View">
                                    <figure className="image-anime">
                                        <Image
                                            src="/images/program-3.jpg"
                                            alt="Development and Job Training"
                                            width={500}
                                            height={300}
                                        />
                                    </figure>
                                </a>
                            </div>
                            <div className="program-body">
                                <div className="program-content">
                                    <h3><a href="program-single.html">Development and Job Training</a></h3>
                                    <p>Providing resources, education, and advocacy for women's rights.</p>
                                </div>
                                <div className="program-button">
                                    <a href="program-single.html" className="readmore-btn">read more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="section-footer-text wow fadeInUp" data-wow-delay="0.6s">
                            <p>Your monthly <a href="#">gift of $36</a> ensures that kids living in poverty have access to life-changing benefits</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurProgram;
