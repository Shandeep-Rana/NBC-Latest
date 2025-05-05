"use client";

import { blogSchema } from '@/lib/blogSchema';
import { addBlog } from '@/Slice/blogs';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const AddBlogForm = () => {

    const dispatch = useDispatch();
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(blogSchema),
    });

    const [previewUrl, setPreviewUrl] = useState("");
    const [ThumbnailUrl, setThumbnailUrl] = useState("");

    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD");
    };


    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("title", data?.title);
        formData.append("author", data?.author);
        formData.append("authorDescription", data?.description);
        formData.append("publish_date", formatDate(data?.publishDate));
        formData.append("content", data?.content);
        formData.append("authorProfile", data?.authorProfile);
        formData.append("thumbnail", data?.thumbnail);
        dispatch(addBlog(formData, navigate, reset));
        setThumbnailUrl("");
        setPreviewUrl("")
    };

    return (
        <>
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
                            defaultValue=""
                        />
                        {errors?.title && (
                            <p style={{ color: "red" }}>{errors?.title?.message}</p>
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
                            defaultValue=""
                        />
                        {errors?.author && (
                            <p style={{ color: "red" }}>
                                {errors?.author?.message}
                            </p>
                        )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                        <label className="text-left">PublishDate of Blog <span style={{ color: '#F15B43' }}>*</span></label>
                        <Controller
                            name="publishDate"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <DatePicker
                                    className={`w-100 antd-date-picker input_fixed_width ${errors?.dob ? 'valid_error' : ''}`}
                                    value={value}
                                    selected={value}
                                    onChange={onChange}
                                    disabledDate={current => current && current > moment().endOf('day')}
                                />
                            )}
                            defaultValue=""
                        />
                        {errors.publishDate && (
                            <p style={{ color: "red" }}>
                                {errors?.publishDate?.message}
                            </p>
                        )}
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
                            defaultValue=""
                        />
                        {errors?.description && (
                            <p style={{ color: "red" }}>
                                {errors?.description?.message}
                            </p>
                        )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                        <div className="mb-2 profile-photo-class">Author Profile</div>
                        <label htmlFor="authorProfile" className="input_fixed_width" style={{ lineHeight: 3 }}>Upload Photo</label>
                        <Controller
                            name="authorProfile"
                            control={control}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <>
                                    <input
                                        id="authorProfile"
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file && file.type.startsWith("image/")) {
                                                const previewUrl = URL.createObjectURL(file);
                                                setPreviewUrl(previewUrl);
                                                onChange(file);
                                            }
                                        }}
                                        onBlur={onBlur}
                                        accept="image/*"
                                    />
                                    {previewUrl && (
                                        <div className="preview-image-container">
                                            <Image
                                                className="preview-image"
                                                src={previewUrl}
                                                alt="Preview"
                                                width={500} // you must provide width
                                                height={300} // you must provide height
                                                objectFit="cover" // optional, depending on your style
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        />
                        {errors?.authorProfile && (
                            <p style={{ color: "red" }}>
                                {errors?.authorProfile?.message}
                            </p>
                        )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                        <div className="mb-2 profile-photo-class">Thumbnail</div>
                        <label htmlFor="thumbnail" className="input_fixed_width" style={{ lineHeight: 3 }}>Upload Photo</label>
                        <Controller
                            name="thumbnail"
                            control={control}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <>
                                    <input
                                        id="thumbnail"
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file && file.type.startsWith("image/")) {
                                                const ThumbnailUrl =
                                                    URL.createObjectURL(file);
                                                setThumbnailUrl(ThumbnailUrl);
                                                onChange(file);
                                            }
                                        }}
                                        onBlur={onBlur}
                                        accept="image/*"
                                    />
                                    {ThumbnailUrl && (
                                        <div className="preview-image-container">
                                            <Image
                                                className="preview-image"
                                                src={ThumbnailUrl}
                                                alt="Preview"
                                                layout="responsive" // You can adjust the layout as needed
                                                width={500} // Specify the width for optimization
                                                height={300} // Specify the height for optimization
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        />
                        {errors?.thumbnail && (
                            <p style={{ color: "red" }}>
                                {errors?.thumbnail?.message}
                            </p>
                        )}
                    </div>
                    {/* <div className="form-group">
                        <label className="text-left">
                            Blog Content <span style={{ color: '#F15B43' }}>*</span>
                        </label>
                        <Controller
                            name="content"
                            control={control}
                            defaultValue=""
                            render={({ field: { value, onChange } }) => {
                                const editor = useEditor({
                                    extensions: [StarterKit],
                                    content: value || '',
                                    onUpdate: ({ editor }) => {
                                        onChange(editor.getHTML());
                                    },
                                });

                                useEffect(() => {
                                    if (editor && value !== editor.getHTML()) {
                                        editor.commands.setContent(value);
                                    }
                                }, [value]);

                                return (
                                    <div className="tiptap-editor">
                                        <EditorContent editor={editor} />
                                    </div>
                                );
                            }}
                        />
                        {errors?.content && (
                            <p style={{ color: "red" }}>{errors?.content?.message}</p>
                        )}
                    </div> */}

                    <div className="submit-area col-lg-12 col-12">
                        <Link href="/admin/all-blogs" className="button-round button-back">
                            Back to List
                        </Link>
                        <button type="submit" className="button-round">
                            Add Blog
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddBlogForm