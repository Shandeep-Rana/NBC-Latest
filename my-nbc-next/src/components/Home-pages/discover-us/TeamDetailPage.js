'use client';

import Image from 'next/image';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

export default function TeamDetailPage() {
    const [activeTab, setActiveTab] = useState('professional_skills');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (

        <>
            <div className="page-header parallaxie">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="page-header-box">
                                <h1 className="text-anime-style-2" data-cursor="-opaque">
                                    <span>Member</span> Login
                                </h1>
                                <nav className="wow fadeInUp">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            Team
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Login
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-team-single">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="page-team-single-box">
                                {/* Team Member Info */}
                                <div className="team-member-info-box">
                                    <div className="team-member-image">
                                        <figure className="image-anime reveal">
                                            <Image
                                                src="/images/team-2.jpg"
                                                alt="Lakshya Garg"
                                                width={400}
                                                height={400}
                                                className="img-fluid"
                                            />
                                        </figure>
                                    </div>

                                    <div className="team-member-content">
                                        <div className="team-info-header">
                                            <div className="team-member-info">
                                                <div className="section-title">
                                                    <h2>Lakshya Garg</h2>
                                                    <p>Co-Founder & Junior Developer</p>
                                                </div>
                                            </div>

                                            {/* Tabs */}
                                            <div className="member-about-box">
                                                <ul className="nav nav-tabs">
                                                    <li className="nav-item">
                                                        <button
                                                            className={`nav-link ${activeTab === 'personal_info' ? 'active' : ''}`}
                                                            onClick={() => handleTabChange('personal_info')}
                                                        >
                                                            Personal Info
                                                        </button>
                                                    </li>
                                                    <li className="nav-item">
                                                        <button
                                                            className={`nav-link ${activeTab === 'professional_skills' ? 'active' : ''}`}
                                                            onClick={() => handleTabChange('professional_skills')}
                                                        >
                                                            Professional Skills
                                                        </button>
                                                    </li>
                                                    <li className="nav-item">
                                                        <button
                                                            className={`nav-link ${activeTab === 'award_win' ? 'active' : ''}`}
                                                            onClick={() => handleTabChange('award_win')}
                                                        >
                                                            Award Win
                                                        </button>
                                                    </li>
                                                </ul>

                                                {/* Tab Content */}
                                                <div className="tab-content mt-4">
                                                    {activeTab === 'personal_info' && (
                                                        <div className="tab-pane fade show active">
                                                            <div className="section-title">
                                                                <h3>About Me</h3>
                                                                <h2>Lakshya Garg</h2>
                                                                <p>
                                                                    Born in the vibrant city of Beirut on January 29, 2013, Lakshya Garg is the young and
                                                                    dynamic force behind our community support website. At just 11 years old, Lakshya embodies
                                                                    a zest for life and a determination to make a positive impact in the world around him.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeTab === 'professional_skills' && (
                                                        <div className="tab-pane fade show active">
                                                            <div className="section-title">
                                                                <p>
                                                                    With a keen interest in technology, Lakshya has delved into the world of coding over the
                                                                    past three years...
                                                                </p>
                                                            </div>
                                                            <div className="skills-progress-bar">
                                                                <div className="skillbar" data-percent="97%">
                                                                    <div className="skill-data">
                                                                        <div className="skill-title">Passionate Learner & Coder</div>
                                                                        <div className="skill-no">97%</div>
                                                                    </div>
                                                                    <div className="skill-progress">
                                                                        <div className="count-bar bg-primary" style={{ width: '97%' }}></div>
                                                                    </div>
                                                                </div>

                                                                <div className="skillbar" data-percent="84%">
                                                                    <div className="skill-data">
                                                                        <div className="skill-title">Advocacy</div>
                                                                        <div className="skill-no">84%</div>
                                                                    </div>
                                                                    <div className="skill-progress">
                                                                        <div className="count-bar bg-success" style={{ width: '84%' }}></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeTab === 'award_win' && (
                                                        <div className="tab-pane fade show active">
                                                            <div className="section-title">
                                                                <h3>Award List</h3>
                                                                <h2>Michael Carter</h2>
                                                                <p>
                                                                    As a dedicated and results-driven professional, I bring years of experience in corporate
                                                                    strategy and team leadership...
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="team-member-experience mt-5">
                                    <div className="team-experience-box">
                                        <div className="section-title">
                                            <h2>Personal Experience</h2>
                                            <p>
                                                Each team member brings a wealth of personal experience that drives their passion for making a
                                                difference...
                                            </p>
                                        </div>
                                        <div className="team-experience-body">
                                            <ul>
                                                <li>Community Engagement</li>
                                                <li>Volunteer Leadership</li>
                                                <li>Grassroots Advocacy</li>
                                                <li>Nonprofit Management</li>
                                                <li>Program Development</li>
                                                <li>Fundraising Campaigns</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <div className="team-contact-form mt-5">
                                    <div className="section-title">
                                        <h2>Get in Touch with Us</h2>
                                    </div>

                                    <form className="contact-form">
                                        <div className="row">
                                            <div className="form-group col-md-6 mb-3">
                                                <input type="text" className="form-control" placeholder="First Name" required />
                                            </div>
                                            <div className="form-group col-md-6 mb-3">
                                                <input type="text" className="form-control" placeholder="Last Name" required />
                                            </div>
                                            <div className="form-group col-md-6 mb-3">
                                                <input type="email" className="form-control" placeholder="E-mail Address" required />
                                            </div>
                                            <div className="form-group col-md-6 mb-3">
                                                <input type="text" className="form-control" placeholder="Phone No." required />
                                            </div>
                                            <div className="form-group col-md-12 mb-3">
                                                <textarea className="form-control" rows="4" placeholder="Write message"></textarea>
                                            </div>
                                            <div className="col-md-12">
                                                <button type="submit" className="btn btn-primary">Send Message</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
