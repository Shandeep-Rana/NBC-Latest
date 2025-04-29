'use client';
import React from 'react'
import Image from 'next/image'

const BlogSection = () => {
    return (
        <div className="our-blog">
            <div className="container">
                <div className="row section-row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">latest post</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">Stories of impact and hope</h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                Explore inspiring stories and updates about our initiatives, successes, and the lives we&apos;ve touched. See how your support is creating real, lasting change in communities worldwide.
                            </p>

                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="post-item wow fadeInUp">
                            <div className="post-item-header">
                                <div className="post-item-meta">
                                    <ul>
                                        <li>10 feb, 2025</li>
                                    </ul>
                                </div>
                                <div className="post-item-content">
                                    <h2><a href="blog-single.html">Youth Leadership Program Inspires the Next Generation</a></h2>
                                </div>
                            </div>
                            <div className="post-featured-image">
                                <a href="blog-single.html" data-cursor-text="View">
                                    <figure className="image-anime">
                                        <Image
                                            src="/images/post-1.jpg"
                                            alt="Post Image 1"
                                            width={400}
                                            height={300}
                                        />
                                    </figure>
                                </a>
                            </div>
                            <div className="blog-item-btn">
                                <a href="blog-single.html" className="readmore-btn">read more</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <div className="post-item wow fadeInUp" data-wow-delay="0.2s">
                            <div className="post-item-header">
                                <div className="post-item-meta">
                                    <ul>
                                        <li>07 feb, 2025</li>
                                    </ul>
                                </div>
                                <div className="post-item-content">
                                    <h2><a href="blog-single.html">Protecting Forests, Futures Our Environmental Mission</a></h2>
                                </div>
                            </div>
                            <div className="post-featured-image">
                                <a href="blog-single.html" data-cursor-text="View">
                                    <figure className="image-anime">
                                        <Image
                                            src="/images/post-2.jpg"
                                            alt="Post Image 2"
                                            width={400}
                                            height={300}
                                        />
                                    </figure>
                                </a>
                            </div>

                            <div className="blog-item-btn">
                                <a href="blog-single.html" className="readmore-btn">read more</a>
                            </div>

                        </div>

                    </div>

                    <div className="col-lg-4 col-md-6">

                        <div className="post-item wow fadeInUp" data-wow-delay="0.4s">

                            <div className="post-item-header">

                                <div className="post-item-meta">
                                    <ul>
                                        <li>04 feb, 2025</li>
                                    </ul>
                                </div>

                                <div className="post-item-content">
                                    <h2><a href="blog-single.html">Partnering for Collaborative Impact Stories</a></h2>
                                </div>

                            </div>

                            <div className="post-featured-image">
                                <a href="blog-single.html" data-cursor-text="View">
                                    <figure className="image-anime">
                                        <Image
                                            src="/images/post-3.jpg"
                                            alt="Post Image 3"
                                            width={400}
                                            height={300}
                                        />
                                    </figure>
                                </a>
                            </div>

                            <div className="blog-item-btn">
                                <a href="blog-single.html" className="readmore-btn">read more</a>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogSection
