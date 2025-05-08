"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";

import Link from "next/link";
import QuillEditor from "@/common/QuillEditor";
import { blogSchema } from "@/lib/blogSchema";
import { getUserInfoFromToken, ROLES } from "@/constants";
import { addBlog } from "@/Slice/blogs";
import AdminLoader from "@/common/AdminLoader";

const AddBlog = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.blog);
    const [user, setUser] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (userInfo) setUser(userInfo);
    }, []);

    console.log(user);

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
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("author", user.userId); 
        formData.append("publish_date", data.publish_date);
        formData.append("thumbnail", data.thumbnail);
        dispatch(addBlog(formData, router, reset, user, setThumbnailUrl));
    };

    if (!user || isLoading) {
        return <AdminLoader />;
    }

    return (
        <div id="content" className="container-fluid mt-2">
            <div className="row text-center mb-2">
                <h1 className="h2">Add Blog</h1>
            </div>
            <div className="volunteer-contact-form">
                <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                    <div className="row">
                        {/* Title */}
                        <div className="col-lg-12 form-group">
                            <label>Blog Title <span className="text-danger">*</span></label>
                            <Controller
                                name="title"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <input className="input_fixed_width" type="text" {...field} />
                                )}
                            />
                            {errors.title && <p className="text-danger">{errors.title.message}</p>}
                        </div>

                        {/* Publish Date */}
                        <div className="col-lg-6 form-group">
                            <label>Publish Date <span className="text-danger">*</span></label>
                            <Controller
                                name="publish_date"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <input
                                        className="input_fixed_width"
                                        type="date"
                                        min={moment().format("YYYY-MM-DD")}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.publish_date && <p className="text-danger">{errors.publish_date.message}</p>}
                        </div>

                        {/* Thumbnail */}
                        <div className="col-lg-6 form-group form-group-file">
                            <div className="mb-2">Thumbnail <span className="text-danger">*</span></div>
                            <label htmlFor="thumbnail" className="input_fixed_width">Upload Photo</label>
                            <Controller
                                name="thumbnail"
                                control={control}
                                render={({ field: { onChange, onBlur } }) => (
                                    <>
                                        <input
                                            id="thumbnail"
                                            type="file"
                                            accept=".jpg,.png,.jpeg"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file && file.type.startsWith("image/")) {
                                                    setThumbnailUrl(URL.createObjectURL(file));
                                                    onChange(file);
                                                }
                                            }}
                                            onBlur={onBlur}
                                        />
                                        {thumbnailUrl && (
                                            <div className="preview-image-container">
                                                <img src={thumbnailUrl} alt="Preview" className="preview-image" />
                                            </div>
                                        )}
                                    </>
                                )}
                            />
                            {errors.thumbnail && <p className="text-danger">{errors.thumbnail.message}</p>}
                        </div>

                        {/* Content */}
                        <div className="col-12 form-group">
                            <label>Content <span className="text-danger">*</span></label>
                            <Controller
                                name="content"
                                control={control}
                                defaultValue=""
                                render={({ field: { value, onChange } }) => (
                                    <QuillEditor value={value} onChange={onChange} />
                                )}
                            />
                            {errors.content && <p className="text-danger">{errors.content.message}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="submit-area col-12">
                            <Link
                                href={user.roleName?.includes(ROLES.Admin) ? "/admin/all-blogs" : "/user/blogs"}
                                className="button-round button-back"
                            >
                                Back to List
                            </Link>
                            <button type="submit" className="button-round">Add Blog</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBlog;
