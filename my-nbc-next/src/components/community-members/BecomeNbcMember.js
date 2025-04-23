'use client';

import React from 'react';
import Link from 'next/link';

const BecomeNbcMember = () => {
    return (
        <>
            <div className="page-header parallaxie">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="page-header-box">
                                <h1 className="text-anime-style-2" data-cursor="-opaque">
                                    <span>Become</span> An NBC Member
                                </h1>
                                <nav className="wow fadeInUp">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Become an NBC Member
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
                                <h4 className="wow fadeInUp" data-wow-delay="0.8s">
                                    Join our vibrant community and gain access to a range of activities and services
                                    designed to enrich our local area. As an NBC member, you can:
                                </h4>

                                <ul className="wow fadeInUp" data-wow-delay="1.2s">
                                    <li>Participate in community activities, cycling, and other sports events.</li>
                                    <li>Offer your skilled services and connect with those in need.</li>
                                    <li>Write blogs and share your thoughts on various topics.</li>
                                    <li>Upload and share your favorite nature photographs taken.</li>
                                    <li>Stay informed about local events and health awareness initiatives.</li>
                                    <li>Learn about best practices for health and financial freedom.</li>
                                </ul>

                                <p className="wow fadeInUp" data-wow-delay="1.4s">
                                    Our platform is designed to support and connect all members of our community.
                                    Register today and start contributing to the growth and well-being of our area!
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 wow fadeInUp text-center" data-wow-delay="0.6s">
                            <Link href="/register" className="text-white btn-default">
                                Register as a NBC Member
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BecomeNbcMember;
