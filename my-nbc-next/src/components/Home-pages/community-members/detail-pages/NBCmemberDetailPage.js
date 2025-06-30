'use client';

import { stringToNumber } from '@/constants/utils';
import { getSkilledPerson } from '@/Slice/skilledPerson';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const NBCmemberDetailPage = () => {

    const { name } = useParams();
    const lastIndex = name.lastIndexOf('-');
    const memberId = name.substring(lastIndex + 1);
    const intID = stringToNumber(memberId);
    console.log(intID)

    const dispatch = useDispatch();
    const { SkilledPerson, isLoading } = useSelector((state) => state.person);

    useEffect(() => {
        dispatch(getSkilledPerson(intID));
    }, [dispatch, intID]);

    const handleGetInTouch = () => {
        const userEmail = SkilledPerson?.email;
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
                                    <span>NBC Member</span> Detail page
                                </h1>
                                <nav className="wow fadeInUp">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/">members</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {SkilledPerson?.name}
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
                                                src={SkilledPerson?.userProfile || "/default-user.png"}
                                                alt={SkilledPerson?.name || "NBC Member"}
                                                width={300}
                                                height={300}
                                            />
                                        </figure>
                                    </div>

                                    <div className="team-member-content">
                                        <div className="team-info-header">
                                            <div className="team-member-info">
                                                <div className="section-title">
                                                    <h2>{SkilledPerson?.name}</h2>
                                                    <p><strong>{SkilledPerson?.email}</strong></p>
                                                    <p><strong>Proffession:</strong> {SkilledPerson?.profession}</p>
                                                    <p><strong>City/Village:</strong> {SkilledPerson?.village}</p>
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
    )
}

export default NBCmemberDetailPage