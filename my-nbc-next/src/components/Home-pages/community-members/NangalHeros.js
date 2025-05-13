'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { getPaginatedHeroes } from '@/Slice/heroSlice';
import Loader from '@/common/Loader';
import { rewriteUrl } from '@/constants';
import { numberToString } from '@/constants/utils';

const NangalHeros = () => {
    const dispatch = useDispatch();
    const [localLoading, setLocalLoading] = useState(false);

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const [state, setState] = useState({
        search: '',
        page: 1,
        pageSize: 9,
    });

    const { allHeroes, hasMoreHeroes, isLoading } = useSelector((state) => state.hero);

    useEffect(() => {
        setLocalLoading(true);

        const delayDebounce = setTimeout(() => {
            dispatch(getPaginatedHeroes(state.search, state.page, state.pageSize))
                .finally(() => setLocalLoading(false));
        }, 1000);

        return () => {
            clearTimeout(delayDebounce);
            setLocalLoading(false);
        };
    }, [dispatch, state.search, state.page, state.pageSize]);

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
            pageSize: prev.pageSize + 9,
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
                                            <span>Nangal</span> Heroes
                                        </h1>
                                        <nav className="wow fadeInUp">
                                            <ol className="breadcrumb">
                                                <li className="breadcrumb-item">
                                                    <Link href="/">home</Link>
                                                </li>
                                                <li className="breadcrumb-item active" aria-current="page">
                                                    Nangal Heroes
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
                            <div className="row">
                                {allHeroes?.length > 0 ? (
                                    allHeroes.map((hero) => (
                                        <div key={hero.hero_id} className="col-lg-3 col-md-6">
                                            <div className="team-item wow fadeInUp">
                                                <div className="team-image">
                                                    <Link href={`/hero/${hero.hero_id}`} data-cursor-text="View">
                                                        <figure className="image-anime position-relative" style={{ height: '280px' }}>
                                                            <Image
                                                                src={hero?.photo_url || '/default-user.png'}
                                                                alt={hero.name}
                                                                layout="fill"
                                                                objectFit="cover"
                                                                className="rounded"
                                                            />
                                                        </figure>
                                                    </Link>
                                                </div>
                                                <div className="team-content">
                                                    <h3>
                                                        <Link href={`/hero/${hero.hero_id}`}>{hero.name}</Link>
                                                    </h3>
                                                    <p className="text-muted mb-4" style={{ padding: '0 48px' }}>{truncateText(hero?.recognition_title, 40)} </p>

                                                    <Link href={`/nangal-hero/${rewriteUrl(hero?.name)}-${numberToString(hero.hero_id)}`} className="readmore-btn mt-3">Read More</Link>

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center mt-4">
                                        <p>No heroes found.</p>
                                    </div>
                                )}

                                {allHeroes?.length > 0 && hasMoreHeroes && (
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

export default NangalHeros;
