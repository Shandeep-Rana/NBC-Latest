'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { getCommunityStats } from '@/Slice/master';

const WhyChooseUs = () => {
    const dispatch = useDispatch();

    const {
        homeAllDonorsCount = 0,
        homeAllVolunteersCount = 0,
        homeAllEventsCount = 0,
        homeAllHeroesCount = 0,
        homeAllMembersCount = 0
    } = useSelector((state) => state.masterSlice);

    useEffect(() => {
        dispatch(getCommunityStats());
    }, [dispatch]);

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
                                    <h2><span className="counter">{homeAllVolunteersCount}</span>+</h2>
                                    <p>Volunteers</p>
                                </div>
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">{homeAllEventsCount}</span>+</h2>
                                    <p>Events Organized</p>
                                </div>
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">{homeAllDonorsCount}</span>+</h2>
                                    <p>Donors</p>
                                </div>
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">{homeAllHeroesCount}</span>+</h2>
                                    <p>Nangal Heroes</p>
                                </div>
                                <div className="why-choose-counter-item">
                                    <h2><span className="counter">{homeAllMembersCount}</span>+</h2>
                                    <p>Registered Members</p>
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
