'use client';
import React from 'react'
import Image from 'next/image'

const Gallery = () => {
    return (
        <div className="our-gallery">
            <div className="container-fluid">
                <div className="row section-row no-gutters">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">gallery</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">Our image gallery</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="our-gallery-nav wow fadeInUp" data-wow-delay="0.2s">
                            <ul>
                                <li><a href="#" className="active-btn" data-filter="*">all</a></li>
                                <li><a href="#" data-filter=".health">health</a></li>
                                <li><a href="#" data-filter=".education">education</a></li>
                                <li><a href="#" data-filter=".food">food</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-12">
                        <div className="gallery-item-boxes">
                            <div className="gallery-item-box health food">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-1.jpg"
                                        alt="Gallery Image 1"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                            <div className="gallery-item-box food">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-2.jpg"
                                        alt="Gallery Image 2"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                            <div className="gallery-item-box food education">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-3.jpg"
                                        alt="Gallery Image 3"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                            <div className="gallery-item-box health education">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-4.jpg"
                                        alt="Gallery Image 4"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                            <div className="gallery-item-box health">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-5.jpg"
                                        alt="Gallery Image 5"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                            <div className="gallery-item-box food education">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-6.jpg"
                                        alt="Gallery Image 6"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                            <div className="gallery-item-box health">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-7.jpg"
                                        alt="Gallery Image 7"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                            <div className="gallery-item-box food">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-8.jpg"
                                        alt="Gallery Image 8"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                            <div className="gallery-item-box education">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-9.jpg"
                                        alt="Gallery Image 9"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                            <div className="gallery-item-box health education">
                                <figure className="image-anime">
                                    <Image
                                        src="/images/gallery-10.jpg"
                                        alt="Gallery Image 10"
                                        width={400}
                                        height={300}
                                    />
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Gallery
