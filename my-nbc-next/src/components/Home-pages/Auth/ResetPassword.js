'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/Slice/authLogin";
import Head from "next/head";
import Loader from "@/common/Loader";

const schema = yup.object({
    otp: yup
        .number()
        .typeError("OTP must be a number")
        .required("OTP is required"),
    password: yup
        .string()
        .required("Password is required")
        .trim(),
    cpassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required")
        .trim(),
}).required();

const ResetPassword = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = useParams();

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
        const requestData = {
            userId: id,
            otp: parseInt(data.otp, 10),
            password: data.password,
        };
        dispatch(resetPassword(requestData, reset, router));
    };

    return (
        <>
            <Head>
                <title>Reset Password | Nangal by Cycle</title>
                <meta name="description" content="Set a new password for your account to regain access to Nangal by Cycle." />
            </Head>

            {isLoading ? (
                <Loader />
            ) : (
                <main id="content" className="site-main">
                    <div className="page-header parallaxie">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <div className="page-header-box">
                                        <h1 className="text-anime-style-2" data-cursor="-opaque">
                                            <span>Member</span> Login
                                        </h1>
                                        <nav className="wow fadeInUp">
                                            <ol className="breadcrumb">
                                                <li className="breadcrumb-item">
                                                    <Link href="/">Home</Link>
                                                </li>
                                                <li className="breadcrumb-item active" aria-current="page">
                                                    Login
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
                                        <p className="fs-3 fst-normal font-monospace">
                                            Reset your Password
                                        </p>
                                        <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                                            <div className="row">
                                                {[
                                                    { name: "otp", label: "OTP", type: "text" },
                                                    { name: "password", label: "Password", type: "password" },
                                                    { name: "cpassword", label: "Confirm Password", type: "password" },
                                                ].map(({ name, label, type }) => (
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group" key={name}>
                                                        <label className="text-left">
                                                            {label} <span style={{ color: '#F15B43' }}>*</span>
                                                        </label>
                                                        <Controller
                                                            name={name}
                                                            control={control}
                                                            defaultValue=""
                                                            render={({ field }) => (
                                                                <input
                                                                    className="input_fixed_width"
                                                                    type={type}
                                                                    {...field}
                                                                />
                                                            )}
                                                        />
                                                        {errors?.[name] && (
                                                            <p style={{ color: "red" }}>{errors[name]?.message}</p>
                                                        )}
                                                    </div>
                                                ))}

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
                                                        Update Password
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};

export default ResetPassword;
