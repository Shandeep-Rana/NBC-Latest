'use client';

import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

export default function TeamDetailPage({ member }) {
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
                                            {member.name}
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
                                                src={member.image}
                                                alt={member.name}
                                                width={605}
                                                height={641.3}
                                                className="img-fluid"
                                            />
                                        </figure>
                                    </div>

                                    <div className="team-member-content">
                                        <div className="team-info-header">
                                            <div className="team-member-info">
                                                <div className="section-title">
                                                    <h2>{member.name}</h2>
                                                    <p>{member.role}</p>
                                                </div>
                                            </div>

                                            {/* Long Description */}
                                            <div className="member-about-box mt-4">
                                                <div className="section-title">
                                                    <h3>About {member.name}</h3>
                                                    <p>{member.description}</p>
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
