'use client'
import { getAllImages } from '@/Slice/gallery';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Gallery = () => {
  const dispatch = useDispatch();
  const { allImages, isLoading } = useSelector((state) => state.image);

  useEffect(() => {
    dispatch(getAllImages());
  }, [dispatch]);

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
                <h3 className="wow fadeInUp">Gallery</h3>
                <h2 className="text-anime-style-2" data-cursor="-opaque">
                  Our Nangal Gallery
                </h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="our-gallery-nav wow fadeInUp" data-wow-delay="0.2s">
                <ul>
                  <li>
                    <Link href="#" className="active-btn" data-filter="*">
                      all
                    </Link>
                  </li>
                  <li>
                    <Link href="#" data-filter=".health">
                      health
                    </Link>
                  </li>
                  <li>
                    <Link href="#" data-filter=".education">
                      education
                    </Link>
                  </li>
                  <li>
                    <Link href="#" data-filter=".food">
                      food
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="gallery-item-boxes">
                {isLoading ? (
                  <p style={{ textAlign: 'center' }}>Loading gallery...</p>
                ) : allImages && allImages.length > 0 ? (
                  allImages.map((item) => (
                    <div
                      key={item.image_id}
                      className={`gallery-item-box ${item.category || ''}`}
                    >
                      <figure className="image-anime">
                        <Image
                          src={item.image_url || '/images/placeholder.jpg'}
                          alt={item.title || 'Gallery Image'}
                          width={600}
                          height={400}
                          layout="responsive"
                          objectFit="cover"
                        />
                      </figure>
                      {/* Optional metadata if available */}
                      {item.title && (
                        <div className="gallery-meta" style={{ padding: '10px' }}>
                          {item.uploaded_by && <p>Uploaded by: {item.uploaded_by}</p>}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center' }}>No images found.</p>
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
