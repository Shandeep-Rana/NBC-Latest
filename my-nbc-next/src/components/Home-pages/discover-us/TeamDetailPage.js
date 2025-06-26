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

                                <div className="team-member-experience">
                                    <div className="team-experience-box">
                                        <div className="section-title">
                                            <h2 className="text-anime-style-2" data-cursor="-opaque">Personal experience</h2>
                                            <p className="wow fadeInUp">
                                                &quot;Each team member brings a wealth of personal experience that drives their passion for making a
                                                difference. From firsthand involvement in community initiatives to years of volunteering and advocacy,
                                                their diverse backgrounds enrich our mission. Their experiences have shaped their commitment to creating
                                                positive change, enabling them to connect deeply with the communities we serve. This personal insight fuels
                                                their dedication to developing impactful programs.&quot;
                                            </p>
                                        </div>
                                        <div className="team-experience-body wow fadeInUp" data-wow-delay="0.2s">
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

                                    <div className="team-contact-form">
                                        <div className="section-title">
                                            <h2 className="text-anime-style-2" data-cursor="-opaque">Get in Touch with Us</h2>
                                        </div>
                                        <div className="contact-form">
                                            <form id="contactForm" action="#" method="POST" data-toggle="validator" className="wow fadeInUp">
                                                <div className="row">
                                                    <div className="form-group col-md-6 mb-4">
                                                        <input type="text" name="fname" className="form-control" id="fname" placeholder="First name" required />
                                                        <div className="help-block with-errors"></div>
                                                    </div>

                                                    <div className="form-group col-md-6 mb-4">
                                                        <input type="text" name="lname" className="form-control" id="lname" placeholder="Last name" required />
                                                        <div className="help-block with-errors"></div>
                                                    </div>

                                                    <div className="form-group col-md-6 mb-4">
                                                        <input type="email" name="email" className="form-control" id="email" placeholder="E-mail address" required />
                                                        <div className="help-block with-errors"></div>
                                                    </div>

                                                    <div className="form-group col-md-6 mb-4">
                                                        <input type="text" name="phone" className="form-control" id="phone" placeholder="Phone no." required />
                                                        <div className="help-block with-errors"></div>
                                                    </div>

                                                    <div className="form-group col-md-12 mb-5">
                                                        <textarea name="message" className="form-control" id="message" rows="4" placeholder="Write message"></textarea>
                                                        <div className="help-block with-errors"></div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <button type="submit" className="btn-default">send message</button>
                                                        <div id="msgSubmit" className="h3 hidden"></div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
