'use client';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { newsSchema } from '@/lib/newsSchema';
import { addNews } from '@/Slice/news';
import QuillEditor from '@/common/QuillEditor';
import AdminLoader from '@/common/AdminLoader';
import Image from 'next/image';
import { getUserInfoFromToken, ROLES } from '@/constants';

const AddNewsForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = getUserInfoFromToken();
    setUser(userInfo);
  }, []);

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const { isLoading } = useSelector((state) => state.news);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(newsSchema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data?.title);
    formData.append("content", data?.content);
    formData.append("author", user?.userId);
    formData.append("publish_date", data?.publish_date);
    formData.append("thumbnail", data?.thumbnail);
    dispatch(addNews(formData, router, reset, user, setThumbnailUrl));
  };

  if (!user || isLoading) {
    return <AdminLoader />;
  }

  return (
    <div id="content">
      <div className="container-fluid mt-2">
        <div className="row text-center mb-2">
          <h1 className="h2">Add News</h1>
        </div>
        <div className="row">
          <div className="volunteer-contact-form">
            <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
              <div className="row">
                <div className="col-12 form-group">
                  <label>News Title <span style={{ color: '#F15B43' }}>*</span></label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <input
                        className="input_fixed_width"
                        type="text"
                        {...field}
                        autoComplete="false"
                      />
                    )}
                    defaultValue=""
                  />
                  {errors?.title && (
                    <p style={{ color: "red" }}>{errors.title.message}</p>
                  )}
                </div>

                <div className="col-md-6 form-group">
                  <label>Publish Date <span style={{ color: '#F15B43' }}>*</span></label>
                  <Controller
                    name="publish_date"
                    control={control}
                    render={({ field }) => (
                      <input
                        className="input_fixed_width"
                        type="date"
                        {...field}
                        min={moment().format('YYYY-MM-DD')}
                      />
                    )}
                    defaultValue=""
                  />
                  {errors.publish_date && (
                    <p style={{ color: "red" }}>{errors.publish_date.message}</p>
                  )}
                </div>

                <div className="col-md-6 form-group form-group-file">
                  <div className="mb-2">Thumbnail <span style={{ color: 'red' }}>*</span></div>
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
                              const previewUrl = URL.createObjectURL(file);
                              setThumbnailUrl(previewUrl);
                              onChange(file);
                            }
                          }}
                          onBlur={onBlur}
                          accept=".jpg,.jpeg,.png"
                        />
                        {thumbnailUrl && (
                          <div className="preview-image-container">
                            <Image
                              className="preview-image"
                              src={thumbnailUrl}
                              alt="Preview"
                              width={365}
                              height={230}
                              style={{ objectFit: 'cover' }}
                              unoptimized // Important if thumbnailUrl is a Blob or local preview
                            />
                          </div>
                        )}
                      </>
                    )}
                  />
                  {errors.thumbnail && (
                    <p style={{ color: "red" }}>{errors.thumbnail.message}</p>
                  )}
                </div>

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

                <div className="submit-area col-12">
                  <Link
                    href={user?.roleName.includes(ROLES.Admin) ? "/admin/news" : "/user/news"}
                    className="button-round button-back"
                  >
                    Back to List
                  </Link>
                  <button type="submit" className="button-round">Add News</button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewsForm;
