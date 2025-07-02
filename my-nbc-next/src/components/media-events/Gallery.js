'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllImages } from '@/Slice/gallery';
import Image from 'next/image';
import Link from 'next/link';
import Fancybox from '@/common/FancyBox';

const Gallery = () => {
  const dispatch = useDispatch();
  const { allImages, galleryCategory } = useSelector((state) => state.image);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(getAllImages());
  }, [dispatch]);

  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
    dispatch(getAllImages(id === 'all' ? null : id));
  };

  const filteredCategories = galleryCategory?.filter(
    (cat) => cat.name?.toLowerCase() !== 'all'
  );

  return (
    <>
      <div className="page-header parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque">
                  <span>Our</span> Gallery
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Gallery
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="our-gallery">
        <div className="container-fluid">
          <div className="row section-row no-gutters">
            <div className="col-lg-12">
              <div className="section-title">
                <h3 className="wow fadeInUp">gallery</h3>
                <h2 className="text-anime-style-2" data-cursor="-opaque">
                  Our image gallery
                </h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="our-gallery-nav wow fadeInUp" data-wow-delay="0.2s">
                <ul>
                  <li>
                    <button
                      className={selectedCategory === 'all' ? 'active-btn' : ''}
                      onClick={() => handleCategoryClick('all')}
                    >
                      all
                    </button>
                  </li>
                  {filteredCategories?.map((cat) => (
                    <li key={cat.id}>
                      <button
                        className={selectedCategory === cat.id ? 'active-btn' : ''}
                        onClick={() => handleCategoryClick(cat.id)}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-12">
              <Fancybox
                options={{
                  Carousel: { infinite: false },
                }}
              >
                <div className="gallery-item-boxes grid">
                  {allImages?.length > 0 ? (
                    allImages.map((img) => (
                      <div
                        className={`gallery-item-box grid-item ${img.category_class || ''}`}
                        key={img.image_id}
                      >
                        <figure className="image-anime">
                          <Link
                            key={img.image_id + '-fancybox'}
                            href={img.image_url}
                            data-fancybox="gallery"
                            data-caption={`Credit To: ${img.uploaded_by || img.title}`}
                            style={{ display: 'block', cursor: 'pointer' }}
                          >
                            <Image
                              src={img.image_url}
                              alt={img.title}
                              width={400}
                              height={300}
                              className="cursor-zoom-in"
                            />
                          </Link>
                        </figure>
                      </div>
                    ))
                  ) : (
                    <p>No images available.</p>
                  )}
                </div>
              </Fancybox>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Gallery;
