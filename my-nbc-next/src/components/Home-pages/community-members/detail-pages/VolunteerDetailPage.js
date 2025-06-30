'use client';

import { stringToNumber } from '@/constants/utils';
import { getuser } from '@/Slice/volunteers';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const VolunteerDetailPage = () => {
    const { name } = useParams();
    const lastIndex = name.lastIndexOf('-');
    const volunteerId = name.substring(lastIndex + 1);
    const intID = stringToNumber(volunteerId);

    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getuser(intID));
    }, [dispatch, intID]);

    const handleGetInTouch = () => {
        const userEmail = user?.email;
        const ccEmail = "info@nangalbycycle.com";
        const mailtoLink = `mailto:${userEmail}?cc=${ccEmail}`;
        window.location.href = mailtoLink;
    };

    return (
        <>
            <div className="page-header parallaxie">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="page-header-box">
                                <h1 className="text-anime-style-2" data-cursor="-opaque">
                                    <span>Volunteer</span> Detail page
                                </h1>
                                <nav className="wow fadeInUp">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/">Volunteers</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {user?.name}
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
                                <div className="team-member-info-box">
                                    <div className="team-member-image">
                                        <figure className="image-anime reveal">
                                            <Image
                                                src={user?.userProfile || "/default-user.png"}
                                                alt={user?.name || "NBC Member"}
                                                width={300}
                                                height={300}
                                            />
                                        </figure>
                                    </div>

                                    <div className="team-member-content">
                                        <div className="team-info-header">
                                            <div className="team-member-info">
                                                <div className="section-title">
                                                    <h2>{user?.name}</h2>
                                                    <p><strong>{user?.email}</strong></p>
                                                    <p><strong>Proffession:</strong> {user?.profession}</p>
                                                    <p><strong>City/Village:</strong> {user?.village}</p>
                                                    <button className="btn btn-primary mt-3" onClick={handleGetInTouch} style={{ backgroundColor: '#f15b43', border: 'none', color: '#fff' }}
                                                    >
                                                        Get In Touch
                                                    </button>
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
};

export default VolunteerDetailPage;
