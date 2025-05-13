'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDonors } from '../../../Slice/bloodDonation';
import { BloodGroupOptions } from '@/constants';
import Loader from '../../../common/Loader';

const Donors = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const dispatch = useDispatch();
  const { donors, isLoading, totalCount } = useSelector((state) => state.donor);

  const [state, setState] = useState({
    search: '',
    selectedBloodGroup: '',
    pageSize: 6,
    page: 1,
  });

  useEffect(() => {
    setLocalLoading(true); 
  
    const delayDebounce = setTimeout(() => {
      dispatch(
        getAllDonors(state.search, state.page, state.pageSize, state.selectedBloodGroup)
      ).finally(() => {
        setLocalLoading(false); 
      });
    }, 1000); 
  
    return () => {
      clearTimeout(delayDebounce);
      setLocalLoading(false); 
    };
  }, [dispatch, state.search, state.page, state.pageSize, state.selectedBloodGroup]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setState((prev) => ({
      ...prev,
      page: 1, 
    }));
  };

  const handleViewMore = () => {
    setState((prev) => ({
      ...prev,
      pageSize: prev.pageSize + 6,
    }));
  };

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
                      <span>Our</span> Donors
                    </h1>
                    <nav className="wow fadeInUp">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link href="/">home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          Donors
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-team">
            <div className="container">
              <form className="row main-contact-info-item" onSubmit={(e) => e.preventDefault()}>
                <div className="col-lg-4 col-sm-4 my-2">
                  <select
                    className="form-control form-control-lg"
                    name="selectedBloodGroup"
                    value={state.selectedBloodGroup}
                    onChange={handleInputChange}
                  >
                    {BloodGroupOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-lg-4 col-sm-4 my-2">
                  <input
                    type="text"
                    name="search"
                    className="form-control form-control-lg bg-white"
                    placeholder="Search Name"
                    value={state.search}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-lg-4 col-sm-4 my-2">
                  <button
                    type="button"
                    className="btn text-white w-100 form-control btn-lg btn-block"
                    style={{ background: 'rgb(241, 91, 68)' }}
                    onClick={handleSearch}
                  >
                    Search Donor
                  </button>
                </div>
              </form>

              <div className="row">
                {donors?.length > 0 ? (
                  donors.map((donor) => (
                    <div key={donor.id || donor.email} className="col-lg-4 col-md-6">
                      <div className="team-item wow fadeInUp">
                        <div className="team-image">
                          <Link href="/team-single.html" data-cursor-text="View">
                            <figure className="image-anime">
                              <Image
                                src={donor.userProfile || '/default-user.png'}
                                alt={donor.name}
                                width={300}
                                height={300}
                              />
                            </figure>
                          </Link>
                        </div>
                        <div className="team-content text-start">
                          <h3>
                            <Link href="/team-single.html">{donor.name}</Link>
                          </h3>
                          <p className="mb-2">
                            <i className="fas fa-tint"></i> Blood Group:{' '}
                            <strong>{donor.bloodType || 'N/A'}</strong>
                          </p>
                          <p className="mb-2">
                            <i className="fas fa-map-marker-alt"></i> {donor.village || 'N/A'}
                          </p>
                          <strong>
                            <a href={`mailto:${donor.email}`}>
                              <i className="fas fa-envelope"></i> {donor.email}
                            </a>
                          </strong>
                          <div className="social-links">
                            <Link className="cutm-con-link mt-4" href="/team-single.html">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center mt-4">
                    <p>No donors found.</p>
                  </div>
                )}

                {donors?.length > 0 && donors.length < totalCount && (
                  <div className="col-12 text-center mt-4">
                    <button className="btn btn-primary" onClick={handleViewMore}>
                      View More
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Donors;
