'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/Slice/authLogin";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import { emailrgx } from "@/constants";
import Loader from "@/common/Loader";

const schema = yup.object({
    email: yup
        .string()
        .matches(emailrgx, "Invalid Email")
        .required("Email is required")
        .trim(),
}).required();

const ForgotPassword = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.userLogin);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        const requestData = { email: data.email };
        dispatch(forgotPassword(requestData, reset, router));
    };

    return (
        <>
            <Head>
                <title>Forgot Password | Nangal by Cycle Account Recovery</title>
                <meta
                    name="description"
                    content="Reset your Nangal by Cycle account password easily. Follow the steps to recover access to your account and continue supporting our mission."
                />
            </Head>

            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="page-header parallaxie">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <div className="page-header-box">
                                        <h1 className="text-anime-style-2" data-cursor="-opaque">
                                            <span>Forgot</span> Password
                                        </h1>
                                        <nav className="wow fadeInUp">
                                            <ol className="breadcrumb">
                                                <li className="breadcrumb-item">
                                                    <Link href="/">Home</Link>
                                                </li>
                                                <li className="breadcrumb-item active" aria-current="page">
                                                    Forgot Password
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="volunteer-wrap">
                        <div className="container">
                            <div className="row mt-5">
                                <div className="col-lg-8 offset-lg-2">
                                    <div className="volunteer-contact-form">
                                        <form
                                            onSubmit={handleSubmit(onSubmit)}
                                            className="volunteer-form"
                                        >
                                            <div className="row">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group">
                                                    <label className="text-left">
                                                        Email Address{" "}
                                                        <span style={{ color: "#F15B43" }}>*</span>
                                                    </label>
                                                    <Controller
                                                        name="email"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <input
                                                                className="input_fixed_width"
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                            />
                                                        )}
                                                        defaultValue=""
                                                    />
                                                    {errors?.email && (
                                                        <p style={{ color: "red" }}>{errors.email.message}</p>
                                                    )}
                                                </div>
                                                <div className="submit-area col-lg-12 col-12 flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => router.push("/auth/login")}
                                                        className="button-back button-round"
                                                        style={{ borderRadius: 6 }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="button-round"
                                                        style={{ borderRadius: 6 }}
                                                    >
                                                        Send OTP
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ForgotPassword;
