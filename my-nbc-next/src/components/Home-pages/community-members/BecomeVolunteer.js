'use client';

import React from 'react';
import Link from 'next/link';

const BecomeVolunteer = () => {
    return (
        <>
            <div className="page-header parallaxie">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="page-header-box">
                                <h1 className="text-anime-style-2" data-cursor="-opaque">
                                    <span>Become</span> A Volunteer
                                </h1>
                                <nav className="breadcrumb-nav">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Become a Volunteer
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-team">
                <div className="container">
                    <div className="row">
                        <div className="post-content">
                            <div className="post-entry">
                                <h2 className="wow fadeInUp" data-wow-delay="0.8s">
                                    Why Volunteer at Nangal By Cycle
                                </h2>
                                <p className="wow fadeInUp">
                                    Are you ready to make a difference in your community while enriching your own life?
                                    Join us in becoming a volunteer for social and sports events organized by local authorities...
                                </p>

                                <h4 className="wow fadeInUp" data-wow-delay="0.8s">
                                    But why should you consider volunteering? Here are some compelling reasons:
                                </h4>

                                <ul className="wow fadeInUp" data-wow-delay="1.2s">
                                    <li><b>Personal Growth:</b> Volunteering provides invaluable opportunities...</li>
                                    <li><b>Community Connection:</b> By volunteering, you become an integral part...</li>
                                    <li><b>Making an Impact:</b> Every act of volunteerism, no matter how small...</li>
                                    <li><b>Building Networks:</b> Volunteering allows you to expand your networks...</li>
                                    <li><b>Sense of Fulfillment:</b> There’s a profound sense of fulfillment...</li>
                                </ul>

                                <p className="wow fadeInUp" data-wow-delay="1.4s">
                                    So why not embark on this meaningful journey of volunteerism today? Together, let’s create a community...
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 wow fadeInUp text-center" data-wow-delay="0.6s">
                            <Link href="/register" className="text-white btn-default">
                                Register as a Volunteer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BecomeVolunteer;
