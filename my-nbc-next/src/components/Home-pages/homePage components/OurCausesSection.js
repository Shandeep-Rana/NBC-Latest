'use client';

import Image from 'next/image';
import Link from 'next/link';

const causesData = [
    {
        title: 'Healthcare Access',
        image: '/images/causes-img-1.jpg',
        description:
            'Nangal By Cycle is committed to making healthcare accessible to all. We conduct medical camps, awareness drives, and provide essential services in underserved areas. Our mission is to ensure that every individual has the opportunity to lead a healthy life, regardless of their background or location.',
    },
    {
        title: 'Art for Awareness',
        image: '/images/program-2.png',
        description:
            'Through creative competitions and workshops, we empower youth to express key social issues. At Nangal By Cycle, art becomes a bridge for communication, raising awareness on topics like education, sustainability, and unity—all through the inspiring lens of creativity.',
    },
    {
        title: 'Pedaling Towards Progress',
        image: '/images/b04f5214-22ca-4853-94e2-22b80315e90c.jpg',
        description:
            'We promote eco-friendly transport and active lifestyles by organizing cycling events that bring people together. Nangal By Cycle envisions cleaner streets, healthier communities, and a stronger sense of unity—one ride at a time.',
    },
];


const OurCausesSection = () => {
    return (
        <section className="our-causes">
            <div className="container">
                <div className="row section-row align-items-center">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">our mission</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">
                                By the Community, For the Community.
                            </h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                Empowering lives through active lifestyle, sports events, and promoting sports culture — building a healthier, stronger society together.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {causesData.map((cause, index) => (
                        <div className="col-lg-4 col-md-6" key={index}>
                            <div className="causes-item wow fadeInUp" data-wow-delay={`${index * 0.2}s`}>
                                <div className="causes-image">
                                    <figure className="image-anime">
                                        <Image src={cause.image} alt={cause.title} width={361.33} height={297} layout="responsive" />
                                    </figure>
                                </div>
                                <div className="causes-body">
                                    <div className="causes-content">
                                        <h3>{cause.title}</h3>
                                        <p>{cause.description}</p>
                                    </div>
                                    <div className="causes-button">
                                        <Link href="/auth/register" className="btn-default">
                                            Become A Volunteer
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
};

export default OurCausesSection;
