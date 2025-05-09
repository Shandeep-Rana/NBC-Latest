import React, { useEffect, useState } from 'react';
import { ROLES, getUserInfoFromToken } from '../../../Components/constant/Constant';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { getNewsById, updateNews } from '@/Slice/news';
import { newsSchema } from '@/lib/newsSchema';
import AdminLoader from '@/common/AdminLoader';
import QuillEditor from '@/common/QuillEditor';
import Image from 'next/image';
import Link from 'next/link';

const schema = yup
  .object({
    title: yup.string().required("Title is required").trim(),
    content: yup.string().required("Content is required").trim(),
    publish_date: yup.string().required("Publish date of news is required"),
    thumbnail: yup.mixed()
      .required("Thumbnail is required")
      .test("fileType", "Invalid file type", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }),
  })
  .required();

const UpdateNews = () => {

  const dispatch = useDispatch();
  const router = useRouter();
  const { newsId } = useParams();
  const userInfo = getUserInfoFromToken();

  const { news, isLoading } = useSelector((state) => state.news);

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isDelay, setIsDelay] = useState(true);

  useEffect(() => {
    dispatch(getNewsById(newsId));
  }, [dispatch, newsId]);

  useEffect(() => {
    if (news?.thumbnail_url) {
      setThumbnailUrl(news.thumbnail_url);
      fetch(news.thumbnail_url)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "thumbnail.jpg", { type: blob.type });
          setFile(file);
        });
    }
  }, [news]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelay(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(newsSchema),
  });

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data?.title);
    formData.append("publish_date", data?.publish_date);
    formData.append("thumbnail", data?.thumbnail);
    formData.append("content", data?.content);
    dispatch(updateNews(news.news_id, userInfo, formData, router));
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
                <h1 className="h2">Update news</h1>
              </div>
              <div className="row">
                <div className="volunteer-contact-form">
                  <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group">
                        <label className="text-left">news Title <span style={{ color: '#F15B43' }}>*</span></label>
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
                          defaultValue={news?.title}
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
                              onChange={onChange}
                            />
                          )}
                          defaultValue={formatDate(news?.publish_date)}
                        />
                        {errors.publish_date && (
                          <p style={{ color: "red", textAlign: 'left' }}>
                            {errors?.publish_date?.message}
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
                          )}
                          defaultValue={file}
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
                        {errors?.thumbnail && (
                          <p style={{ color: "red", textAlign: 'left' }}>
                            {errors?.thumbnail?.message}
                          </p>
                        )}
                      </div>
                      <div className="col-12 form-group">
                        <label>Content <span className="text-danger">*</span></label>
                        <Controller
                          name="content"
                          control={control}
                          defaultValue={news?.content}
                          render={({ field: { value, onChange } }) => (
                            <QuillEditor value={value} onChange={onChange} />
                          )}
                        />
                        {errors.content && <p className="text-danger">{errors.content.message}</p>}
                      </div>
                      <div className="submit-area col-lg-12 col-12">
                        <Link href={userInfo.roleName.includes(ROLES.Admin) ? "/admin/news" : "/user/news"} className="button-round button-back">
                          Back to List
                        </Link>
                        <button type="submit" className="button-round">
                          Update news
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

export default UpdateNews