'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogById } from '@/Slice/blogs';
import { useParams } from 'next/navigation';
import { stringToNumber } from '@/constants/utils';
import moment from 'moment';
import Loader from '@/common/Loader';

export default function BlogView() {
  const dispatch = useDispatch();
  const { title } = useParams();
  const blogId = title?.substring(title.lastIndexOf('-') + 1);
  const intID = stringToNumber(blogId);

  const [imageUrls, setImageUrls] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  const { blog, isLoading } = useSelector((state) => state.blog);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    setLocalLoading(true);
    const delayDebounce = setTimeout(() => {
      if (intID) dispatch(getBlogById(intID)).finally(() => {
        setLocalLoading(false);
      });
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      setLocalLoading(false);
    };
  }, [dispatch, intID]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (blog?.content) {
      const contentWithoutImages = blog.content.replace(/<img[^>]*>/g, '');
      setTextContent(contentWithoutImages);

      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(blog.content, 'text/html');
      const imgElements = htmlDoc.querySelectorAll('img');
      const imgUrls = Array.from(imgElements).map((img) => img.src);
      const finalImageUrls = blog.thumbnail_url ? [blog.thumbnail_url, ...imgUrls] : imgUrls;
      setImageUrls(finalImageUrls);
    }
  }, [blog]);

  const formatDate = (date) => moment(date).format('MMMM DD, YYYY');

  return (
    <>
      {localLoading || isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="page-header parallaxie">
            <div className="container">
              <div className="row items-center">
                <div className="col-lg-12">
                  <div className="page-header-box">
                    <h1 className="text-anime-style-2" data-cursor="-opaque">
                      {blog?.title}
                    </h1>
                    <nav className="wow fadeInUp">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link href="/">home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          <Link href="/blog">blog</Link>
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Post Section */}
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
                          alt={blog?.title}
                          width={1200}
                          height={600}
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
                          {blog?.tags?.length > 0 && (
                            <div className="post-tags wow fadeInUp" data-wow-delay="0.5s">
                              <span className="tag-links">
                                Tags:
                                {blog.tags.map((tag, idx) => (
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
                                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog?.title || '')}`}
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
                                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog?.title || '')}`}
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
                        Posted by <strong>{blog?.author_name || 'Admin'}</strong> on {formatDate(blog?.created_at)}
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
  );
};