'use client';

import Loader from '@/common/Loader';
import { contactSchema } from '@/lib/utils/UtilsSchemas';
import { addrequest } from '@/Slice/contactRequest';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';

const ContactUs = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const { isLoading } = useSelector((state) => state.contact);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(contactSchema),
    });

    const onSubmit = async (data) => {
        const requestData = {
            name: data?.name,
            email: data?.email.toLowerCase(),
            subject: data?.subject,
            phone: data?.phone,
            description: data?.description,
        };
        dispatch(addrequest(requestData, reset, router));
    };

    return (
        <div className="donate-now parallaxie">
            <div className="container">
                <div className="row align-items-center">

                    <div className="col-lg-6">
                        <div className="intro-video-box">
                            <div className="video-play-button">
                                <a
                                    href="https://www.youtube.com/watch?v=Y-x0efG1seA"
                                    className="popup-video"
                                    data-cursor-text="Play"
                                >
                                    <i className="fa-solid fa-play"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="donate-box">
                            <div className="section-title">
                                <h3 className="wow fadeInUp">Get In Touch</h3>
                                <h2 className="text-anime-style-2" data-cursor="-opaque">Contact us</h2>
                                <p className="wow fadeInUp" data-wow-delay="0.2s">
                                    Your generous support enables us to continue our mission of spreading love and serving the community.
                                </p>
                            </div>
                            {isLoading ? <Loader /> : (
                                <div className="donate-form wow fadeInUp" data-wow-delay="0.4s">
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="wow fadeInUp"
                                    >
                                        <div className="row">
                                            <div className="form-group col-md-6 mb-4">
                                                <Controller
                                                    name="name"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            placeholder="Your Name*"
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            autoComplete="false"
                                                            className="form-control"
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.name && (
                                                    <p style={{ color: "red", whiteSpace: "nowrap" }}>
                                                        {" "}
                                                        {errors?.name?.message}
                                                    </p>
                                                )}
                                                <div className="help-block with-errors"></div>
                                            </div>

                                            <div className="form-group col-md-6 mb-4">
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            placeholder="Your Email*"
                                                            type="email"
                                                            value={value}
                                                            onChange={onChange}
                                                            autoComplete="false"
                                                            className="form-control"
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.email && (
                                                    <p style={{ color: "red", whiteSpace: "nowrap" }}>
                                                        {" "}
                                                        {errors?.email?.message}
                                                    </p>
                                                )}
                                                <div className="help-block with-errors"></div>
                                            </div>

                                            <div className="form-group col-md-12 mb-4">
                                                <Controller
                                                    name="subject"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            placeholder="Subject*"
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            autoComplete="false"
                                                            className="form-control"
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.subject && (
                                                    <p style={{ color: "red", whiteSpace: "nowrap" }}>
                                                        {" "}
                                                        {errors?.subject?.message}
                                                    </p>
                                                )}
                                                <div className="help-block with-errors"></div>
                                            </div>

                                            <div className="form-group col-md-12 mb-4">
                                                <Controller
                                                    name="phone"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <PhoneInput
                                                            country={"in"}
                                                            value={value}
                                                            onChange={(phone) => onChange(phone)}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.phone && (
                                                    <p style={{ color: "red", whiteSpace: "nowrap" }}>
                                                        {" "}
                                                        {errors?.phone?.message}
                                                    </p>
                                                )}
                                                <div className="help-block with-errors"></div>
                                            </div>

                                            <div className="form-group col-md-12 mb-5">
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <textarea
                                                            rows={8}
                                                            placeholder="Enter Your Message*"
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            className="form-control"
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.description && (
                                                    <p style={{ color: "red", whiteSpace: "nowrap" }}> {errors?.description?.message}</p>
                                                )}
                                                <div className="help-block with-errors"></div>
                                            </div>

                                            <div className="col-md-12">
                                                <button type="submit" className="btn-default"><span>send message</span></button>
                                                <div id="msgSubmit" className="h3 hidden"></div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div >
        </div >
    );
};

export default ContactUs;
