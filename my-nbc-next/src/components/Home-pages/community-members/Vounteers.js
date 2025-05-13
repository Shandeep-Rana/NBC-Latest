'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVolunteers } from '../../../Slice/volunteers';
import Loader from '../../../common/Loader';
import { getAllVillages } from '@/Slice/master';

const Volunteers = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const dispatch = useDispatch();
  const { volunteers, isLoading, totalCount } = useSelector((state) => state.user);
  const { villages } = useSelector((state) => state.masterSlice);

  const villageOptions = villages?.map((village) => ({
    value: village.villageId,
    label: village.villageName,
  }));
  villageOptions.unshift({ value: "null", label: "Select Village" });

  const [state, setState] = useState({
    search: '',
    selectedVillage: '',
    pageSize: 6,
    page: 1,
  });

  useEffect(() => {
    setLocalLoading(true);
  
    const delayDebounce = setTimeout(() => {
      dispatch(getAllVolunteers(state.search, state.page, state.pageSize, state.selectedVillage))
        .finally(() => setLocalLoading(false));
  
      dispatch(getAllVillages());
    }, 1000);
  
    return () => {
      clearTimeout(delayDebounce);
      setLocalLoading(false);
    };
  }, [dispatch, state.search, state.page, state.pageSize, state.selectedVillage]);  

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
                    <span>Our</span> Volunteers
                  </h1>
                  <nav className="wow fadeInUp">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link href="/">home</Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Volunteers
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
                  name="selectedVillage"
                  value={state.selectedVillage}
                  onChange={handleInputChange}
                >
                  {villageOptions.map((option) => (
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
                  Search Volunteer
                </button>
              </div>
            </form>

            <div className="row">
              {volunteers?.length > 0 ? (
                volunteers.map((volunteer) => (
                  <div key={volunteer.id || volunteer.email} className="col-lg-4 col-md-6">
                    <div className="team-item wow fadeInUp">
                      <div className="team-image">
                        <Link href="/team-single.html" data-cursor-text="View">
                          <figure className="image-anime">
                            <Image
                              src={volunteer.userProfile || '/default-user.png'}
                              alt={volunteer.name}
                              width={300}
                              height={300}
                            />
                          </figure>
                        </Link>
                      </div>
                      <div className="team-content text-start">
                        <h3>
                          <Link href="/team-single.html">{volunteer.name}</Link>
                        </h3>
                        <p className="mb-2">
                          <i className="fas fa-map-marker-alt"></i> {volunteer.village || 'N/A'}
                        </p>
                        <strong>
                          <a href={`mailto:${volunteer.email}`}>
                            <i className="fas fa-envelope"></i> {volunteer.email}
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
                  <p>No volunteers found.</p>
                </div>
              )}

              {volunteers?.length > 0 && volunteers.length < totalCount && (
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

export default Volunteers;
