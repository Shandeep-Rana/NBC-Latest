
"use client";

import { stringToNumber, stripHtmlTags } from '@/constants/utils';
import { getHeroDetail } from '@/Slice/heroSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const NangalHeroDetailPage = () => {
    const { id } = useParams();

    const lastIndex = id.lastIndexOf('-');
    const heroId = id.substring(lastIndex + 1);
    const intID = stringToNumber(heroId);
    const dispatch = useDispatch();

    const { heroDetails, isLoading } = useSelector((state) => state.hero);

    useEffect(() => {
        dispatch(getHeroDetail(intID));
    }, [dispatch, id])

    return (
        <>
            <div className="page-header parallaxie">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="page-header-box">
                                <h1 className="text-anime-style-2" data-cursor="-opaque">
                                    <span>Nangal Hero</span>
                                </h1>
                                <nav className="wow fadeInUp">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/communitymembers/nangal-heros">NangalHeros</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {heroDetails?.name}
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
                                    <div className="team-member-image text-center mb-4">
                                        <figure className="image-anime reveal">
                                            <Image
                                                src={heroDetails?.photo_url}
                                                alt={heroDetails?.name}
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
                                                    <h2>{heroDetails?.name}</h2>
                                                    {/* <p>{heroDetails?.role}</p>  */}
                                                </div>
                                            </div>

                                            {/* Long Description */}
                                            <div className="member-about-box mt-4">
                                                <div className="section-title">
                                                    <h3>About
                                                    </h3>
                                                    <div dangerouslySetInnerHTML={{ __html: heroDetails?.recognition_description }} />
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

export default NangalHeroDetailPage