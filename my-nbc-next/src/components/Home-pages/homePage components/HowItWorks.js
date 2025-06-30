'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HowItWorks = () => {
    return (
        <div className="how-it-work">
            <div className="container">
                <div className="row section-row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">Welcome to our Service Directory, dedicated space created</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">
                                By the Community and for the Community.
                            </h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                Our mission is to foster a supportive and connected environment for the residents of our Beautiful Nangal and the surrounding 100+ villages. We believe in the power of collective effort and aim to make a positive impact on the lives of our community members through various initiatives.
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
                                            src="/images/b04f5214-22ca-4853-94e2-22b80315e90c.jpg"
                                            alt="Healthcare Support"
                                            width={295}
                                            height={255.47}
                                            layout="responsive"
                                        />
                                    </figure>
                                </div>
                                <div className="how-it-work-content wow fadeInUp" data-wow-delay="0.4s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-how-it-work-1.svg"
                                            alt="Icon 1"
                                            width={55}
                                            height={55}
                                        />
                                    </div>
                                    <div className="how-it-work-body">
                                        <h3>Volunteer Participation</h3>
                                        <p>We encourage community members to get involved in local projects and events. Volunteering is a great way to give back, meet new people, and make a difference. Together, we can tackle local challenges and create a stronger, more vibrant community.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="how-it-work-item">
                                <div className="how-it-work-image">
                                    <figure className="image-anime reveal">
                                        <Image
                                            src="/images/how-it-work-img-4.jpg"
                                            alt="Plan and Design"
                                            width={295}
                                            height={255.47}
                                            layout="responsive"
                                        />
                                    </figure>
                                </div>
                                <div className="how-it-work-content wow fadeInUp" data-wow-delay="0.4s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-how-it-work-2.png"
                                            alt="Icon 2"
                                            width={55}
                                            height={55}
                                        />
                                    </div>
                                    <div className="how-it-work-body">
                                        <h3>Blood Donation</h3>
                                        <p>Blood donation is a critical need that can save lives. We organize regular blood drives and provide information on where and how you can donate. Join us in this lifesaving effort and become a hero to those in need.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="how-it-work-item">
                                <div className="how-it-work-image">
                                    <figure className="image-anime reveal">
                                        <Image
                                            src="/images/program-2.png"
                                            alt="Implement Solutions"
                                            width={295}
                                            height={255.47}
                                            layout="responsive"
                                        />
                                    </figure>
                                </div>
                                <div className="how-it-work-content wow fadeInUp" data-wow-delay="0.6s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-how-it-work-3.svg"
                                            alt="Icon 3"
                                            width={55}
                                            height={55}
                                        />
                                    </div>
                                    <div className="how-it-work-body">
                                        <h3>Health Awareness</h3>
                                        <p>Good health is the foundation of a happy life. Our health awareness programs aim to educate and inform community members about healthy living, preventive care, and managing common health issues.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="how-it-work-item">
                                <div className="how-it-work-image">
                                    <figure className="image-anime reveal">
                                        <Image
                                            src="/images/IMG_8163.JPG"
                                            alt="Report and Share"
                                            width={295}
                                            height={255.47}
                                            layout="responsive"
                                        />
                                    </figure>
                                </div>
                                <div className="how-it-work-content wow fadeInUp" data-wow-delay="0.6s">
                                    <div className="icon-box">
                                        <Image
                                            src="/images/icon-how-it-work-4.png"
                                            alt="Icon 4"
                                            width={55}
                                            height={55}
                                        />
                                    </div>
                                    <div className="how-it-work-body">
                                        <h3>Promoting Active Sports</h3>
                                        <p>Physical activity is essential for overall well-being. We promote active sports and recreational activities to encourage a healthy lifestyle. From local sports events to regular fitness sessions, something for everyone to get moving and stay fit.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-12">
                        <div className="section-footer-text how-work-footer-text wow fadeInUp" data-wow-delay="0.8s">
                            <p>
                                Together, we can build healthier, stronger communities.{' '}
                                <Link href="contact">Contact us</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
