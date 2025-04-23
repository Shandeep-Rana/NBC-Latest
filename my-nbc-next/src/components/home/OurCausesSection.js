'use client';

import Image from 'next/image';
import Link from 'next/link';

const causesData = [
    {
        title: 'Healthcare access',
        image: '/images/causes-img-1.jpg',
        description:
            'At Nangal By Cycle, we believe that access to healthcare is a basic human right, not a privilege. We aim to bring essential medical support to underserved communities by organizing health camps, mobile clinics, and awareness drives. We work to guarantee that no one is left behind in terms of their well-being, from regular examinations to preventive care. We can create stronger, healthier communities if we work together.',
    },
    {
        title: 'Save the Environment',
        image: '/images/causes-img-2.jpg',
        description:
            'A greener tomorrow starts today. Nangal By Cycle environmental mission focuses on reforestation, clean-up initiatives, and spreading awareness about sustainable practices. Whether it\'s planting trees or teaching young people about conservation, we are dedicated to preserving our planet for future generations to live. Every small action contributes significantly to the creation of a healthier Earth.',
    },
    {
        title: 'Books for Education',
        image: '/images/causes-img-3.jpg',
        description:
            'Education is the foundation for opportunity. Nangal By Cycle works to provide books, learning materials, and educational resources to children in underprivileged areas. We hope to close the learning gap and motivate the next generation of leaders by organizing donation drives and giving school materials. A child holding a book is a start toward his better future.',
    },
];


const OurCausesSection = () => {
    return  (
        <section className="our-causes">
            <div className="container">
                <div className="row section-row align-items-center">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">our causes</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">
                                Together for a Better Tomorrow.
                            </h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                Empowering lives through healthcare, education, and a greener planet—one community at a time.
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
                                        <Link href="/become-a-volunteer" className="btn-default">
                                            Become A Volunteer
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurCausesSection;
