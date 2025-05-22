'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useParams, useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import Loader from '@/common/Loader';
import { getUserDataById, resendOtp } from '@/Slice/authLogin';
import { verifyOtp } from '@/Slice/authRegister';

const schema = yup.object({
    otp: yup.string().required('OTP is required'),
}).required();

function ValidateAccount() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.userLogin);
    const { isLoading: resendOtpLoder } = useSelector((state) => state.userRegister);

    let userId = id;
    let eventId = null;

    if (id.includes('-')) {
        const lastDashIndex = id.lastIndexOf('-');
        userId = id.substring(0, lastDashIndex);
        eventId = id.substring(lastDashIndex + 1);
    }

    useEffect(() => {
        dispatch(getUserDataById(id));
    }, [dispatch, id]);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const navigateBasedOnEventId = () => {
        if (eventId) {
            router.push(`/event/participation/${eventId}`);
        } else {
            router.push('/auth/signin');
        }
    };

    const onSubmit = async (data) => {
        const otp = data?.otp;
        const requestData = {
            userId: userId,
            otp: parseInt(otp, 10),
        };
        dispatch(verifyOtp(requestData, navigateBasedOnEventId));
    };

    const handleResendButtonClick = async (e) => {
        e.preventDefault();
        const requestData = {
            userId: userId,
        };
        dispatch(resendOtp(requestData));
    };

    return (
        <>
            {(isLoading || resendOtpLoder) ? (
                <Loader />
            ) : (
                <main id="content" className="site-main">
                    <div className="page-header parallaxie">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <div className="page-header-box">
                                        <h1 className="text-anime-style-2" data-cursor="-opaque">
                                            <span>Member</span> Varify Account
                                        </h1>
                                        <nav className="wow fadeInUp">
                                            <ol className="breadcrumb">
                                                <li className="breadcrumb-item">
                                                    <Link href="/">Home</Link>
                                                </li>
                                                <li className="breadcrumb-item active" aria-current="page">
                                                    Varify Account
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
                                            Please provide otp sent on your email/number
                                        </p>

                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="row">
                                                <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                                                    <label className="text-left">
                                                        OTP <span style={{ color: '#F15B43' }}>*</span>
                                                    </label>
                                                    <Controller
                                                        name="otp"
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
                                                    {errors?.otp && (
                                                        <p style={{ color: 'red' }}>{errors?.otp?.message}</p>
                                                    )}
                                                </div>
                                                <div className="d-flex">
                                                    <div className="submit-area col-lg-7 me-1">
                                                        <button type="submit" className="button-round">
                                                            Submit
                                                        </button>
                                                    </div>
                                                    <div className="submit-area">
                                                        <button
                                                            className="button-round"
                                                            onClick={handleResendButtonClick}
                                                        >
                                                            Resend OTP
                                                        </button>
                                                    </div>
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
}

export default ValidateAccount;
