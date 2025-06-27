"use client"
import { getAllImages } from '@/Slice/gallery';
import { getCommunityStats } from '@/Slice/master';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';

const MembersCountSection = () => {

    const [widthPercentage, setWidthPercentage] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const dispatch = useDispatch();
    const { homeAllDonorsCount, homeAllVolunteersCount, homeAllEventsCount, homeAllHeroesCount, homeAllMembersCount } = useSelector((state) => state.masterSlice);
    const { galleryImages } = useSelector((state) => state.image);

    useEffect(() => {
        dispatch(getCommunityStats());
        dispatch(getAllImages());
    }, []);

    useEffect(() => {
        const counts = [homeAllVolunteersCount, homeAllDonorsCount, homeAllHeroesCount, homeAllEventsCount, homeAllMembersCount];
        const nonZeroCounts = counts.filter(count => count > 0).length;
        const width = nonZeroCounts > 0 ? 100 / nonZeroCounts : 0;
        setWidthPercentage(width);
        setIsLoaded(true);
    }, [homeAllVolunteersCount, homeAllDonorsCount, homeAllHeroesCount, homeAllEventsCount, homeAllMembersCount]);

    return (
        <section className="home-about home-about-section py-5" data-aos="fade-up" data-aos-anchor-placement="top-center" data-aos-duration="1000">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="home-about-left">
                            <div className="home-about-image">
                                <Carousel indicators={false} controls={false} slide={true} interval={4000}>
                                    {galleryImages?.slice(0, 5).map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <Image
                                                src={image?.image_url} // Assuming each image object has an image_url property
                                                alt={`Gallery Image ${index + 1}`}
                                                style={{
                                                    width: '1100px',  // Set your desired width
                                                    height: '500px', // Set your desired height
                                                    objectFit: 'cover', // Ensures the image covers the area without distortion
                                                }}
                                                className="d-block" // Keep Bootstrap's d-block class for display
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>
                            <div className="counter-wrap">
                                {/* Your existing counter code */}
                                {homeAllVolunteersCount > 0 && (
                                    <div className="counter-item" style={{ width: `${widthPercentage}%` }}>
                                        <span className="counter-no">
                                            <span className="counter">{homeAllVolunteersCount ? homeAllVolunteersCount : 0}</span>
                                        </span>
                                        <span className="counter-text">Volunteers</span>
                                    </div>
                                )}
                                {homeAllDonorsCount > 0 && (
                                    <div className="counter-item" style={{ width: `${widthPercentage}%` }}>
                                        <span className="counter-no">
                                            <span className="counter">{homeAllDonorsCount ? homeAllDonorsCount : 0}</span>
                                        </span>
                                        <span className="counter-text">Donors</span>
                                    </div>
                                )}
                                {homeAllMembersCount > 0 && (
                                    <div className="counter-item" style={{ width: `${widthPercentage}%` }}>
                                        <span className="counter-no">
                                            <span className="counter">{homeAllMembersCount ? homeAllMembersCount : 0}</span>
                                        </span>
                                        <span className="counter-text">Members</span>
                                    </div>
                                )}
                                {homeAllHeroesCount > 0 && (
                                    <div className="counter-item" style={{ width: `${widthPercentage}%` }}>
                                        <span className="counter-no">
                                            <span className="counter">{homeAllHeroesCount}</span>
                                        </span>
                                        <span className="counter-text">Our Heroes</span>
                                    </div>
                                )}
                                {homeAllEventsCount > 0 && (
                                    <div className="counter-item" style={{ width: `${widthPercentage}%` }}>
                                        <span className="counter-no">
                                            <span className="counter">{homeAllEventsCount ? homeAllEventsCount : 0}</span>
                                        </span>
                                        <span className="counter-text">Events</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MembersCountSection