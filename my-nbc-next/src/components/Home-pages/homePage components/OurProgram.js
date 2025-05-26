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
                                At Nangal By Cycle, we&apos;re all about building a better, healthier, and more connected community. Here&apos;s a look at the programs that brought us together and made a difference in and around Nangal.
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
                                            src="/images/program-1.png"
                                            alt="Women's empowerment"
                                            width={321.11}
                                            height={225.09}
                                        />
                                    </figure>
                                </a>
                            </div>
                            <div className="program-body">
                                <div className="program-content">
                                    <h3>Blood Donation Camp</h3>
                                    <p> Our very first Blood Donation Camp was a heartwarming success — thanks to the spirit of the people of Nangal!.</p>
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
                                            src="/images/program-2.png"
                                            alt="Housing assistance"
                                            width={321.11}
                                            height={225.09}
                                        />
                                    </figure>
                                </a>
                            </div>
                            <div className="program-body">
                                <div className="program-content">
                                    <h3><a href="program-single.html">Art Competition</a></h3>
                                    <p>We celebrated creativity with an open-theme Art Competition that gave kids, teens, and adults a chance to showcase their imagination and love for Nangal.</p>
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
                                            src="/images/program-1.jpg"
                                            alt="Development and Job Training"
                                            width={321.11}
                                            height={225.09}
                                        />
                                    </figure>
                                </a>
                            </div>
                            <div className="program-body">
                                <div className="program-content">
                                    <h3><a href="program-single.html">Plantation Drive</a></h3>
                                    <p>We rolled up our sleeves and planted hundreds of saplings to make Nangal greener and cleaner.</p>
                                </div>
                                <div className="program-button">
                                    <a href="program-single.html" className="readmore-btn">read more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default OurProgram;
