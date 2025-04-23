'use client';
import { getPaginatedBlogs } from "@/Slice/blogs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Loader from "@/common/Loader";
import { numberToString } from "@/constants/utils";
import { rewriteUrl } from "@/constants";

const Blogs = () => {
  const isPublished = true;
  const isApproved = true;
  const dispatch = useDispatch();
  const { blogsList, isLoading, blogsCount } = useSelector((state) => state.blog);

  const [localLoading, setLocalLoading] = useState(false);

  const [state, setState] = useState({
    search: "",
    page: 1,
    pageSize: 9,
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
  }, [dispatch, state.search, state.page, state.pageSize]);

  const handleViewMore = () => {
    setState((prevState) => ({
      ...prevState,
      pageSize: prevState.pageSize + 6,
    }));
  };

  const formatDate = (dateStr) => moment(dateStr).format("DD MMM, YYYY");

  return (
    <>
      {localLoading || isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="page-header parallaxie">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-12">
                  <div className="page-header-box">
                    <h1 className="text-anime-style-2" data-cursor="-opaque">
                      <span>Latest</span> blog
                    </h1>
                    <nav className="wow fadeInUp">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link href="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          blog
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-blog">
            <div className="container">
              <div className="row">
                {blogsList?.length > 0 ? blogsList.map((post, index) => {
                  const blogUrl = `/blog/${rewriteUrl(post?.title || "")}-${numberToString(post?.blog_id || 0)}`;

                  return (
                    <div className="col-lg-4 col-md-6" key={post.id || index}>
                      <div className="post-item wow fadeInUp" data-wow-delay={`${index * 0.2}s`}>
                        <div className="post-featured-image">
                          <Link href={blogUrl}>
                            <figure className="image-anime">
                              <Image
                                src={post.thumbnail_url}
                                alt={post.title}
                                width={400}
                                height={250}
                                layout="responsive"
                                objectFit="cover"
                              />
                            </figure>
                          </Link>
                        </div>

                        <div className="post-item-header">
                          <div className="post-item-meta">
                            <ul>
                              <li>{formatDate(post.published_on)}</li>
                            </ul>
                          </div>
                          <div className="post-item-content">
                            <h2>
                              <Link href={blogUrl}>
                                {post.title}
                              </Link>
                            </h2>
                          </div>
                        </div>

                        <div className="blog-item-btn">
                          <Link href={blogUrl} className="readmore-btn">
                            read more
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-12 text-center">
                    <p>No blogs found.</p>
                  </div>
                )}
              </div>

              {blogsList.length < blogsCount && (
                <div className="row">
                  <div className="col-12 text-center mt-4">
                    <button className="btn btn-primary" onClick={handleViewMore}>
                      {localLoading ? 'Loading...' : 'View More'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Blogs;
