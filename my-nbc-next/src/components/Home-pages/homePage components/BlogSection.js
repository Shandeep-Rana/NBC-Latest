'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getPaginatedBlogs } from '@/Slice/blogs';
import { rewriteUrl } from '@/constants';
import { numberToString } from '@/constants/utils';

const BlogSection = () => {

    const isPublished = true;
    const isApproved = true;
    const dispatch = useDispatch();
    const { blogsList, isLoading, blogsCount } = useSelector((state) => state.blog);

    const [localLoading, setLocalLoading] = useState(false);

    const [state, setState] = useState({
        search: "",
        page: 1,
        pageSize: 3,
    });

    useEffect(() => {
        setLocalLoading(true);
        const delayDebounce = setTimeout(() => {
            dispatch(getPaginatedBlogs(state.search, state.page, state.pageSize, null, isPublished, isApproved)).finally(() => {
                setLocalLoading(false);
            });
        }, 500);

        return () => {
            clearTimeout(delayDebounce);
            setLocalLoading(false);
        };
    }, [dispatch, state.search, state.page, state.pageSize, isPublished, isApproved]);


    const handleViewMore = () => {
        setState((prevState) => ({
            ...prevState,
            pageSize: prevState.pageSize + 6,
        }));
    };

    const formatDate = (dateStr) => moment(dateStr).format("DD MMM, YYYY");

    return (
        <div className="our-blog">
            <div className="container">
                <div className="row section-row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">latest post</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">
                                Stories of impact and hope
                            </h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                Explore inspiring stories and updates about our initiatives, successes, and the lives we've touched. See how your support is creating real, lasting change in communities worldwide.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {localLoading ? (
                        <div className="col-12 text-center">Loading...</div>
                    ) : blogsList?.length > 0 ? (
                        blogsList.map((blog, index) => {
                            const blogUrl = `/media&events/blog/${rewriteUrl(blog?.title || "")}-${numberToString(blog?.blog_id || 0)}`;

                            return (
                                <div className="col-lg-4 col-md-6" key={blog.blogId}>
                                    <div className="post-item wow fadeInUp" data-wow-delay={`${index * 0.2}s`}>
                                        <div className="post-item-header">
                                            <div className="post-item-meta">
                                                <ul>
                                                    <li>{formatDate(blog.published_on || blog.created_at)}</li>
                                                </ul>
                                            </div>
                                            <div className="post-item-content">
                                                <h2>
                                                    <Link href={blogUrl}>
                                                        {blog.title}
                                                    </Link>
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="post-featured-image">
                                            <Link href={blogUrl} data-cursor-text="View">
                                                <figure className="image-anime">
                                                    <Image
                                                        src={blog.thumbnail_url || '/images/default-post.jpg'}
                                                        alt={blog.title}
                                                        width={400}
                                                        height={300}
                                                    />
                                                </figure>
                                            </Link>
                                        </div>
                                        <div className="blog-item-btn">
                                            <Link href={blogUrl} className="readmore-btn">
                                                read more
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center">No blogs found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogSection;
