'use client'

import Loader from '@/common/Loader';
import { stringToNumber } from '@/constants/utils';
import { getNewsById } from '@/Slice/news';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const NewsView = () => {

    const dispatch = useDispatch();
    const { title } = useParams();
    const lastIndex = title.lastIndexOf('-');
    const newsId = title.substring(lastIndex + 1);
    const intID = stringToNumber(newsId);
    const [imageUrls, setImageUrls] = useState([0]);
    const [textContent, setTextContent] = useState("");
    const { news, isLoading } = useSelector((state) => state.news);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        dispatch(getNewsById(intID));
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(window.location.href);
        }
    }, []);

    useEffect(() => {
        if (news && news?.content) {
            const content = news?.content?.replace(/<img[^>]*>/g, '');
            setTextContent(content);
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(news?.content, "text/html");
            const imageElements = htmlDoc.querySelectorAll("img");
            const urls = Array.from(imageElements)?.map((img) => img.src);

            let imageUrls = urls;
            if (news.thumbnail_url != null) {
                imageUrls = [
                    news?.thumbnail_url,
                    ...urls,
                ];
            }
            setImageUrls(imageUrls);
        }
    }, [news]);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,
    };

    const formatDate = (day) => moment(day).format("MMMM DD, YYYY");

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="page-header parallaxie">
                        <div className="container">
                            <div className="row items-center">
                                <div className="col-lg-12">
                                    <div className="page-header-box">
                                        <h1 className="text-anime-style-2" data-cursor="-opaque">
                                            {news?.title}
                                        </h1>
                                        <nav className="wow fadeInUp">
                                            <ol className="breadcrumb">
                                                <li className="breadcrumb-item">
                                                    <Link href="/">home</Link>
                                                </li>
                                                <li className="breadcrumb-item active" aria-current="page">
                                                    <Link href="/media&events/news">news</Link>
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* news Post Section */}
                    <div className="page-single-post py-12">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    {/* Featured Image */}
                                    {imageUrls.length > 0 && (
                                        <div className="post-image mb-6">
                                            <figure className="image-anime reveal">
                                                <Image
                                                    src={imageUrls[0]}
                                                    alt={news?.title}
                                                    width={1200}
                                                    height={675}
                                                    className="w-full h-auto"
                                                />
                                            </figure>
                                        </div>
                                    )}

                                    {/* Post Content */}
                                    <div className="post-content space-y-6">
                                        <div className="post-entry">
                                            <div
                                                className="react_quill_editor wow fadeInUp"
                                                dangerouslySetInnerHTML={{ __html: textContent }}
                                            />
                                        </div>

                                        {/* Tags and Social Sharing */}
                                        <div className="post-tag-links">
                                            <div className="row items-center">
                                                <div className="col-lg-8">
                                                    {news?.tags?.length > 0 && (
                                                        <div className="post-tags wow fadeInUp" data-wow-delay="0.5s">
                                                            <span className="tag-links">
                                                                Tags:
                                                                {news.tags.map((tag, idx) => (
                                                                    <Link href="#" className="ml-2" key={idx}>{tag}</Link>
                                                                ))}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="post-social-sharing wow fadeInUp" data-wow-delay="0.5s">
                                                        <ul className="flex space-x-4">
                                                            {/* Facebook */}
                                                            <li>
                                                                <Link
                                                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <i className="fa-brands fa-facebook-f"></i>
                                                                </Link>
                                                            </li>

                                                            {/* LinkedIn */}
                                                            <li>
                                                                <Link
                                                                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(news?.title || '')}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <i className="fa-brands fa-linkedin-in"></i>
                                                                </Link>
                                                            </li>

                                                            {/* Instagram (redirect to profile - no direct share URL) */}
                                                            <li>
                                                                <Link
                                                                    href="https://www.instagram.com/"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <i className="fa-brands fa-instagram"></i>
                                                                </Link>
                                                            </li>

                                                            {/* Twitter (X) */}
                                                            <li>
                                                                <Link
                                                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(news?.title || '')}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <i className="fa-brands fa-x-twitter"></i>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Author & Date */}
                                        <div className="mt-6 wow fadeInUp">
                                            <p className="text-sm text-gray-500">
                                                Posted by <strong>{news?.author_name || 'Admin'}</strong> on {formatDate(news?.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default NewsView