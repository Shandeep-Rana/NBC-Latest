'use client';

import React from 'react';

const ContactUs = () => {
    return (
        <div className="donate-now parallaxie">
            <div className="container">
                <div className="row align-items-center">

                    <div className="col-lg-6">
                        <div className="intro-video-box">
                            <div className="video-play-button">
                                <a
                                    href="https://www.youtube.com/watch?v=Y-x0efG1seA"
                                    className="popup-video"
                                    data-cursor-text="Play"
                                >
                                    <i className="fa-solid fa-play"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="donate-box">
                            <div className="section-title">
                                <h3 className="wow fadeInUp">Get In Touch</h3>
                                <h2 className="text-anime-style-2" data-cursor="-opaque">Contact us</h2>
                                <p className="wow fadeInUp" data-wow-delay="0.2s">
                                    Your generous support enables us to continue our mission of spreading love and serving the community.
                                </p>
                            </div>

                            <div className="donate-form wow fadeInUp" data-wow-delay="0.4s">
                                <form id="donateForm" action="#" method="POST">
                                    <div className="form-group mb-4">
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-4">
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-4">
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            placeholder="Phone"
                                            required
                                        />
                                    </div>
                                    <div className="form-group-btn">
                                        <button type="submit" className="btn-default">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;
