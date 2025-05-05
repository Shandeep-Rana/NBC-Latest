"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useRouter } from "next/navigation";
import { ROLES, getUserInfoFromToken } from "@/constants";
import { blogSchema } from "@/lib/blogSchema";
import { addBlog } from "@/Slice/blogs";
import QuillEditor from "@/common/QuillEditor";
import Link from "next/link";

export default function AddBlogForm() {
    const dispatch = useDispatch();
    const router = useRouter();
    const userInfo = getUserInfoFromToken();
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const { isLoading } = useSelector((state) => state.blog);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(blogSchema),
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("title", data?.title);
        formData.append("content", data?.content);
        formData.append("author", userInfo.userId);
        formData.append("publish_date", data?.publish_date);
        formData.append("thumbnail", data?.thumbnail);

        dispatch(addBlog(formData, router, reset, userInfo, setThumbnailUrl));
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group">
                            <label className="text-left">Blog Title <span style={{ color: '#F15B43' }}>*</span></label>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <input
                                        className={`input_fixed_width`}
                                        type="text"
                                        value={value}
                                        onChange={onChange}
                                        autoComplete="false"
                                    />
                                )}
                                defaultValue=""
                            />
                            {errors?.title && (
                                <p style={{ color: "red", textAlign: 'left' }}>{errors?.title?.message}</p>
                            )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                            <label className="text-left">Publish Date <span style={{ color: '#F15B43' }}>*</span></label>
                            <Controller
                                name="publish_date"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <input
                                        className="input_fixed_width"
                                        type="date"
                                        value={value}
                                        onChange={e => onChange(e.target.value)}
                                        min={moment().format('YYYY-MM-DD')}
                                    />
                                )}
                                defaultValue=""
                            />
                            {errors.publish_date && (
                                <p style={{ color: "red", textAlign: 'left' }}>
                                    {errors?.publish_date?.message}
                                </p>
                            )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                            <div className="mb-2 profile-photo-class">Thumbnail <span style={{ color: 'red' }}>*</span></div>
                            <label htmlFor="thumbnail" className="input_fixed_width" style={{ lineHeight: 3 }}>Upload Photo</label>
                            <Controller
                                name="thumbnail"
                                control={control}
                                render={({ field: { onChange, onBlur } }) => (
                                    <>
                                        <input
                                            id="thumbnail"
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file && file.type.startsWith("image/")) {
                                                    const thumbnailUrl = URL.createObjectURL(file);
                                                    setThumbnailUrl(thumbnailUrl);
                                                    onChange(file);
                                                }
                                            }}
                                            onBlur={onBlur}
                                            accept=".jpg,.png,.jpeg"
                                        />
                                        {thumbnailUrl && (
                                            <div className="preview-image-container">
                                                <img
                                                    className="preview-image"
                                                    src={thumbnailUrl}
                                                    alt="Preview"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            />
                            {errors?.thumbnail && (
                                <p style={{ color: "red", textAlign: 'left' }}>
                                    {errors?.thumbnail?.message}
                                </p>
                            )}
                        </div>
                        
                        <div className="col-12 form-group">
                            <label className="text-left">
                                Blog Content <span style={{ color: '#F15B43' }}>*</span>
                            </label>
                            <Controller
                                name="content"
                                control={control}
                                defaultValue=""
                                render={({ field: { value, onChange } }) => (
                                    <QuillEditor 
                                    value={value} 
                                    onChange={onChange} />
                                )}
                            />
                            {errors?.content && <p style={{ color: "red" }}>{errors.content.message}</p>}
                        </div>

                        <div className="submit-area col-lg-12 col-12">
                            <Link href={userInfo.roleName.includes(ROLES.Admin) ? "/admin/all-blogs" : "/user/blogs"} className="button-round button-back">
                                Back to List
                            </Link>
                            <button type="submit" className="button-round">
                                Add Blog
                            </button>
                        </div>
                    </div>
                </form>
            )
            }
        </>
    );
}
