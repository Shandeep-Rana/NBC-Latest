"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

import { emailrgx } from "@/constants";
import Loader from "@/common/Loader";
import { loginUser } from "@/Slice/authLogin";
import Loginbg from "../../../public/images/loginbg.jpg"

const schema = yup.object({
    email: yup
        .string()
        .required("Email is required")
        .matches(emailrgx, "Invalid Email")
        .trim(),
    password: yup.string().required("Password is required").trim(),
}).required();

const Login = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [eye, setEye] = useState(true);
    const { isLoading } = useSelector((state) => state.userLogin);

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        dispatch(loginUser(data, router, reset));
    };

    return (
        <>
            <Head>
                <title>Nangal By Cycle Member Login | Access Your Account</title>
                <meta
                    name="description"
                    content="Secure login page for Nangal By Cycle members. Access your account to manage bookings, update your profile, or contribute to our community."
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

                    <div
                        className="volunteer-wrap"
                        style={{ backgroundImage: `url(${Loginbg.src})` }}
                    >
                        <Image
                            href="/images/loginbg"
                            alt="Login Background"
                            fill
                            className="object-cover"
                            quality={100}
                        />
                        <div className="container">
                            <div className="row pt-5">
                                <div className="col-lg-8 offset-lg-2">
                                    <div className="volunteer-contact-form">
                                        <form
                                            onSubmit={handleSubmit(onSubmit)}
                                            className="volunteer-form"
                                        >
                                            <div className="row">
                                                <div className="col-lg-12 form-group">
                                                    <label htmlFor="email">
                                                        Email Address <span style={{ color: "#F15B43" }}>*</span>
                                                    </label>
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="text"
                                                        className={`input_fixed_width ${errors?.email ? "valid_error" : ""}`}
                                                        {...register("email")}
                                                        autoComplete="off"
                                                    />
                                                    {errors?.email && (
                                                        <div className="text-left invalid_col">
                                                            {errors.email.message}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-lg-12 form-group">
                                                    <label htmlFor="password">
                                                        Password <span style={{ color: "#F15B43" }}>*</span>
                                                    </label>
                                                    <div className="pass-group" style={{ position: "relative" }}>
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            type={eye ? "password" : "text"}
                                                            className={`input_fixed_width ${errors?.password ? "valid_error" : ""}`}
                                                            {...register("password")}
                                                            autoComplete="off"
                                                        />
                                                        <span
                                                            onClick={() => setEye(!eye)}
                                                            className={`fa toggle-password ${eye ? "fa-eye-slash" : "fa-eye"}`}
                                                            style={{
                                                                position: "absolute",
                                                                right: "10px",
                                                                top: "50%",
                                                                transform: "translateY(-50%)",
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    </div>
                                                    {errors?.password && (
                                                        <div className="text-left invalid_col">
                                                            {errors.password.message}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="submit-area col-lg-12">
                                                    <button
                                                        type="submit"
                                                        className="button-round"
                                                        style={{ borderRadius: 6 }}
                                                    >
                                                        Login
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="mt-3">
                                            <Link href="/auth/forgotpassword">Forgotten password?</Link>
                                            <p className="mt-2">
                                                Don&apos;t have an account?{" "}
                                                <Link href="/auth/register">Register here</Link>
                                            </p>
                                        </div>
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

export default Login;
