"use client";

import Loader from '@/common/Loader';
import { blogSchema } from '@/lib/blogSchema';
import { getBlogByTitle, updateBlog } from '@/Slice/blogs';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const UpdateBlog = () => {
    const { blog, isLoading } = useSelector((state) => state.blog);
    const { title } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBlogByTitle(title));
    }, [dispatch, title]);

    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD");
    };

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(blogSchema),
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("title", data?.title);
        formData.append("author", data?.author);
        formData.append("authorDescription", data?.description);
        formData.append("publish_date", data?.publishDate);
        formData.append("content", data?.content);
        formData.append("thumbnail", blog.thumbnail);
        dispatch(updateBlog(title, formData));
    };

    return (
        isLoading ? (
            <Loader />
        ) : (
            <div id="content">
                <div className="row">
                    <div className="col-lg-12 col-md-8">
                        <div className="row my-4">
                            <div className="text-center">
                                <h3>Update Blog</h3>
                            </div>
                            <div className="card-body pt-0">
                                <div className="volunteer-contact-form">
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="volunteer-form"
                                    >
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
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
                                                    defaultValue={blog?.title}
                                                />
                                                {errors?.title && (
                                                    <p style={{ color: "red" }}>
                                                        {errors?.title?.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Author Name <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="author"
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
                                                    defaultValue={blog?.author}
                                                />
                                                {errors?.author && (
                                                    <p style={{ color: "red" }}>
                                                        {errors?.author?.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Date Of Publish <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="publishDate"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            className={`input_fixed_width`}
                                                            type="date"
                                                            value={value}
                                                            onChange={onChange}
                                                        />
                                                    )}
                                                    defaultValue={formatDate(blog?.publish_date)}
                                                />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Author Description <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <textarea
                                                            className={`input_fixed_width`}
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                        />
                                                    )}
                                                    defaultValue={blog?.authorDescription}
                                                />
                                                {errors?.description && (
                                                    <p style={{ color: "red" }}>
                                                        {errors?.description?.message}
                                                    </p>
                                                )}
                                            </div>
                                            <h3>Blog Content</h3>
                                            {/* <div className="form-group">
                                                <Controller
                                                    name="content"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <ReactQuill
                                                            modules={{
                                                                toolbar: {
                                                                    container: [
                                                                        [
                                                                            { header: "1" },
                                                                            { header: "2" },
                                                                            { header: [3, 4, 5, 6] },
                                                                            { font: [] },
                                                                        ],
                                                                        [{ size: [] }],
                                                                        [
                                                                            "bold",
                                                                            "italic",
                                                                            "underline",
                                                                            "strike",
                                                                            "blockquote",
                                                                        ],
                                                                        [{ list: "ordered" }, { list: "bullet" }],
                                                                        ["link", "video"],
                                                                        ["link", "image", "video"],
                                                                        ["clean"],
                                                                        ["code-block"],
                                                                    ],
                                                                    handlers: {},
                                                                },
                                                            }}
                                                            value={value}
                                                            onChange={onChange}
                                                        />
                                                    )}
                                                    defaultValue={blog?.content}
                                                />
                                                {errors?.content && (
                                                    <p style={{ color: "red" }}>
                                                        {errors?.content?.message}
                                                    </p>
                                                )}
                                            </div> */}
                                            <div className="submit-area col-lg-12 col-12">
                                                <Link href="/admin/blog/bloglist" className="button-round button-back">
                                                    Back to List
                                                </Link>
                                                <button type="submit" className="button-round">
                                                    Update Blog
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default UpdateBlog;
