"use client";

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addHero } from '@/Slice/heroSlice';
import AdminLoader from '@/common/AdminLoader';
import QuillEditor from '@/common/QuillEditor';
import { heroSchema } from '@/lib/utils/UtilsSchemas';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserInfoFromToken } from '@/constants';
import Image from 'next/image';

function AddHero() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (userInfo) setUser(userInfo);
    }, []);

    const [photoUrl, setPhotoUrl] = useState("");

    const { isLoading } = useSelector((state) => state.hero);

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
        dispatch(addHero(formData, user?.userId, router, reset, setPhotoUrl));
    };

    return (
        <>
            {isLoading ? (
                <AdminLoader />
            ) : (
                <div id="content">
                    <div className="container-fluid mt-2">
                        <div className="row text-center mb-2">
                            <h1 className="h2">Add Hero</h1>
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
                                                defaultValue=""
                                            />
                                            {errors?.name && (
                                                <div className={`text-left invalid_col`}>
                                                    {errors?.name?.message}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-6 form-group">
                                            <label className="text-left">Achievement Title </label>
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
                                                defaultValue=""
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                            <label className="text-left">Achievement Date</label>
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
                                                defaultValue=""
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
                                                                    const thumbnailUrl = URL.createObjectURL(file);
                                                                    setPhotoUrl(thumbnailUrl);
                                                                    onChange(file);
                                                                }
                                                            }}
                                                            onBlur={onBlur}
                                                            accept=".jpg,.png,.jpeg"
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
                                                Add Hero
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddHero;