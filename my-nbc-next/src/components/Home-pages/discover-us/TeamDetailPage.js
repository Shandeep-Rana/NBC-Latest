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
                                    <span>Team</span> Member
                                </h1>
                                <nav className="wow fadeInUp">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {member?.name}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
