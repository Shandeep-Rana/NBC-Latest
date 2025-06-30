'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '@/Slice/events';
import { rewriteUrl } from '@/constants';
import { numberToString, stripHtmlTags } from '@/constants/utils';

const OurProgram = () => {
    const dispatch = useDispatch();
    const state = { search: "", page: 1, pageSize: 3 };

    const { events } = useSelector((state) => state.event);

    useEffect(() => {
        dispatch(getAllEvents(state.search, state.page, state.pageSize));
    }, [dispatch]);

    return (
        <div className="our-program">
            <div className="container">
                <div className="row section-row align-items-center">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">our events</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">Empowering our programs</h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                At Nangal By Cycle, we&apos;re all about building a better, healthier, and more connected community. Here&apos;s a look at the programs that brought us together and made a difference in and around Nangal.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {events && events.length > 0 ? (
                        events.map((event, index) => (
                            <div className="col-lg-4 col-md-6" key={event.eventId}>
                                <div className="program-item wow fadeInUp" data-wow-delay={`${index * 0.2}s`}>
                                    <div className="program-image">
                                        <Link href={`/media&events/event/${rewriteUrl(event?.title)}-${numberToString(event?.eventId)}`}>
                                            <figure className="image-anime">
                                                <Image
                                                    src={event?.imageUrl}
                                                    alt={event.title}
                                                    width={321.11}
                                                    height={225.09}
                                                />
                                            </figure>
                                        </Link>
                                    </div>
                                    <div className="program-body">
                                        <div className="program-content">
                                            <h3>{event.title}</h3>
                                            <p>
                                                {event.short_description ||
                                                    (stripHtmlTags(event.description)?.slice(0, 100) + '...')}
                                            </p>
                                        </div>
                                        <div className="program-button">
                                            <Link href={`/media&events/event/${rewriteUrl(event?.title)}-${numberToString(event?.eventId)}`} className="readmore-btn">
                                                read more
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-lg-12">
                            <p>No programs found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OurProgram;
