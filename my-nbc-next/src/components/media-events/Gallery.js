'use client';
import { getAllImages } from '@/Slice/gallery';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const Gallery = () => {
  const dispatch = useDispatch();
  const { allImages, galleryCategory, isLoading } = useSelector((state) => state.image);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(getAllImages());
  }, [dispatch]);

  useLayoutEffect(() => {
    NativeFancybox.destroy();
    NativeFancybox.bind('[data-fancybox="gallery"]', {
      Carousel: { infinite: false },
    });

    return () => NativeFancybox.destroy();
  }, [allImages]);

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
                  <span>Nangal</span> Gallery
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Nangal Gallery
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
              <div className="gallery-item-boxes grid">
                {allImages && Array.isArray(allImages) && allImages.length > 0 ? (
                  allImages.map((img) => (
                    <div
                      className={`gallery-item-box grid-item ${img.category_class || ''}`}
                      key={img.image_id}
                    >
                      <figure className="image-anime">
                        <a
                          href={img.image_url}
                          data-fancybox="gallery"
                          data-caption={img.title}
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
          </div>
        </div>
        </div>
    </>
  );
};

export default Gallery;
