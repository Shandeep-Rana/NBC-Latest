'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllImages } from '@/Slice/gallery';
import { useRouter } from 'next/navigation';
import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import Image from 'next/image';

const Gallery = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { allImages, galleryCategory } = useSelector((state) => state.image);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch all images when component mounts or category changes
  useEffect(() => {
    dispatch(getAllImages());
  }, [dispatch]);

  // Bind Fancybox after images are updated and DOM is ready
  useLayoutEffect(() => {
    NativeFancybox.destroy();
    NativeFancybox.bind('[data-fancybox="gallery"]', {
      Carousel: { infinite: false },
    });

    return () => NativeFancybox.destroy(); // cleanup
  }, [allImages]);

  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
    dispatch(getAllImages(id === 'all' ? null : id));
  };

  const filteredCategories = galleryCategory?.filter(
    (cat) => cat.name?.toLowerCase() !== 'all'
  );

  const visibleImages = allImages?.slice(0, 10);

  const handleViewMore = () => {
    router.push('/media&events/gallery');
  };

  return (
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
            <div className="gallery-item-boxes grid">
              {visibleImages && visibleImages.length > 0 ? (
                visibleImages.map((img) => (
                  <div
                    className={`gallery-item-box grid-item ${img.category_class || ''}`}
                    key={img.image_id}
                  >
                    <figure className="image-anime">
                      <a
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
                        />
                      </a>
                    </figure>
                  </div>
                ))
              ) : (
                <p>No images available.</p>
              )}
            </div>
          </div>

          <div className="col-lg-12 text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={handleViewMore}
              style={{ backgroundColor: '#f15b43', borderColor: '#f15b43' }}
            >
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
