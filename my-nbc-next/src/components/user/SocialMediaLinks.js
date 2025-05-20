'use client';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { facebookrgx, getUserInfoFromToken, instagramrgx, linkedinrgx, ROLES, twitterrgx, youtubergx } from "@/constants";
import Loader from "@/common/Loader";
import { addLink, userLinks } from "@/Slice/socialMediaSlice";

const schema = yup.object({
  facebook: yup
    .string()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .matches(facebookrgx, "Invalid URL")
    .trim(),
  youtube: yup
    .string()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .matches(youtubergx, "Invalid URL")
    .trim(),
  linkedin: yup
    .string()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .matches(linkedinrgx, "Invalid URL")
    .trim(),
  instagram: yup
    .string()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .matches(instagramrgx, "Invalid URL")
    .trim(),
  twitter: yup
    .string()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .matches(twitterrgx, "Invalid URL")
    .trim(),
}).required();

const SocialMediaLinks = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = getUserInfoFromToken();
    if (userInfo) setUser(userInfo);
  }, []);

  const [isDelay, setIsDelay] = useState(true);
  const isAdmin = user?.roleName?.includes(ROLES.Admin);
  const backPath = isAdmin ? "/admin/all-events" : "/user/events";
  const userId = user?.userId;

  const { userlinks, isLoading } = useSelector((state) => state.socialMedia);

  useEffect(() => {
    if (userId) dispatch(userLinks(userId));
  }, [dispatch, userId]);

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
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      twitter: "",
      instagram: "",
      facebook: "",
      youtube: "",
      linkedin: "",
    },
  });

  useEffect(() => {
    if (userlinks) {
      Object.keys(userlinks).forEach((field) => {
        control.setValue(field, userlinks[field] || "");
      });
    }
  }, [userlinks, control]);

  const watchAllFields = watch();
  const isAnyFieldFilled = Object.values(watchAllFields).some((value) => !!value);

  const onSubmit = async (data) => {
    const requestData = {
      youtube: data.youtube,
      twitter: data.twitter,
      linkedin: data.linkedin,
      facebook: data.facebook,
      instagram: data.instagram,
    };
    dispatch(addLink(userId, requestData));
  };

  return isLoading || isDelay ? (
    <Loader />
  ) : (
    <div id="content">
      <div className="volunteer-contact-form">
        <h3>Add Social Media Links</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
          {["twitter", "instagram", "facebook", "youtube", "linkedin"].map((platform) => (
            <div key={platform} className="col-lg-12 col-md-12 col-sm-12 col-12 form-group">
              <label className="text-left">{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
              <Controller
                name={platform}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    className="input_fixed_width"
                    type="text"
                    value={value || ""}
                    onChange={onChange}
                    autoComplete="off"
                  />
                )}
              />
              {errors?.[platform] && (
                <p style={{ color: "red", textAlign: "left" }}>{errors[platform]?.message}</p>
              )}
            </div>
          ))}

          <div className="submit-area col-lg-12 col-12">
            <button
              type="button"
              className="button-round button-back"
              onClick={() => router.push(backPath)}
            >
              Back to List
            </button>
            <button type="submit" className="button-round" disabled={!isAnyFieldFilled}>
              Add Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
