"use client";

import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { getHeroDetail, updateHero } from '@/Slice/heroSlice';
import { heroSchema } from '@/lib/utils/UtilsSchemas';
import AdminLoader from '@/common/AdminLoader';
import { getUserInfoFromToken } from '@/constants';
import Link from 'next/link';
import QuillEditor from '@/common/QuillEditor';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';

function UpdateHero() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();

    const [photoUrl, setPhotoUrl] = useState("");
    const [file, setFile] = useState(null);
    const [isDelay, setIsDelay] = useState(true);
    const { heroDetails, isLoading } = useSelector((state) => state.hero);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (userInfo) setUser(userInfo);
    }, []);

    useEffect(() => {
        dispatch(getHeroDetail(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (heroDetails?.photo_url) {
            setPhotoUrl(heroDetails.photo_url);
            fetch(heroDetails.photo_url)
                .then((res) => res.blob())
                .then((blob) => {
                    const file = new File([blob], `photo_url${heroDetails.hero_Id}.jpg`, { type: blob.type });
                    setFile(file);
                });
        }
    }, [heroDetails]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDelay(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const formatDate = (date) => moment(date).format("YYYY-MM-DD");

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(heroSchema),
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data?.name);
        formData.append("recognition_title", data?.recognition_title);
        formData.append("recognition_description", data?.recognition_description);
        formData.append("recognition_date", data?.recognition_date);
        formData.append("photo_url", data?.photo_url);
        dispatch(updateHero(id, user?.userId, formData, router, reset, setPhotoUrl));
    };

    return (
        <>
            {
                isLoading || isDelay ? (
                    <AdminLoader />
                ) : (
                    <div id="content">
                        <div className="container-fluid mt-2">
                            <div className="row text-center mb-2">
                                <h1 className="h2">Update Hero Details</h1>
                            </div>
                            <div className="row">
                                <div className="volunteer-contact-form">
                                    <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-6 form-group">
                                                <label className="text-left">Name <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="name"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            className={`input_fixed_width ${errors?.name ? "valid_error" : ""}`}
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            autoComplete="false"
                                                        />
                                                    )}
                                                    defaultValue={heroDetails?.name}
                                                />
                                                {errors?.name && (
                                                    <div className={`text-left invalid_col`}>
                                                        {errors?.name?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-6 form-group">
                                                <label className="text-left">Achievement Title</label>
                                                <Controller
                                                    name="recognition_title"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            className={`input_fixed_width ${errors?.recognition_title ? "valid_error" : ""}`}
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            autoComplete="false"
                                                        />
                                                    )}
                                                    defaultValue={heroDetails?.recognition_title}
                                                />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Achievement Date </label>
                                                <Controller
                                                    name="recognition_date"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            className={`input_fixed_width ${errors?.recognition_date ? "valid_error" : ""}`}
                                                            type="date"
                                                            value={value}
                                                            onChange={e => onChange(e.target.value)}
                                                            max={new Date().toISOString().split('T')[0]}
                                                        />
                                                    )}
                                                    defaultValue={formatDate(heroDetails?.recognition_date)}
                                                />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                                                <div className="mb-2 profile-photo-class">Hero Profile <span style={{ color: '#F15B43' }}>*</span></div>
                                                <label htmlFor="photo_url" className={`input_fixed_width ${errors?.recognition_date ? "valid_error" : ""}`} style={{ lineHeight: 3 }}>Upload Photo</label>
                                                <Controller
                                                    name="photo_url"
                                                    control={control}
                                                    render={({ field: { onChange, onBlur } }) => (
                                                        <>
                                                            <input
                                                                id="photo_url"
                                                                type="file"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file && file.type.startsWith("image/")) {
                                                                        const photoUrl = URL.createObjectURL(file);
                                                                        setPhotoUrl(photoUrl);
                                                                        onChange(file);
                                                                    }
                                                                }}
                                                                onBlur={onBlur}
                                                                accept=".jpg,.jpeg,.png"
                                                            />
                                                            {photoUrl && (
                                                                <div className="preview-image-container relative w-full max-w-xs h-64">
                                                                    <Image
                                                                        src={photoUrl}
                                                                        alt="Preview"
                                                                        width={300}
                                                                        height={200}
                                                                        className="preview-image rounded object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                    defaultValue={file}
                                                />
                                                {errors?.photo_url && (
                                                    <div className={`text-left invalid_col`}>
                                                        {errors?.photo_url?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group">
                                                <label className="text-left">Achievement Description <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="recognition_description"
                                                    control={control}
                                                    defaultValue=""
                                                    render={({ field: { value, onChange } }) => (
                                                        <QuillEditor
                                                            value={value}
                                                            onChange={onChange} />
                                                    )}
                                                />
                                                {errors?.recognition_description && <p style={{ color: "red" }}>{errors.recognition_description.message}</p>}
                                            </div>
                                            <div className="submit-area col-lg-12 col-12">
                                                <Link href={"/admin/nangalheros/nangalheroslist"} className="button-round button-back">
                                                    Back to List
                                                </Link>
                                                <button type="submit" className="button-round">
                                                    Update Hero
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default UpdateHero