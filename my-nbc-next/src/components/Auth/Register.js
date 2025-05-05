'use client';

import React, { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRegisterRoleDonor, updateRegisterRoleVolunteer, updateRegisterRoleBoth } from "../../Slice/master";
import { RegisterRoles } from "../../constants";
import { useSearchParams } from "next/navigation";
import Head from 'next/head';
import Link from "next/link";

// Your main Register component
const RegisterComponent = () => {
    const dispatch = useDispatch();
    const { registerRoleCheck } = useSelector(state => state.masterSlice);
    const searchParams = useSearchParams();
    const role = searchParams.get('role');

    useEffect(() => {
        if (role === 'donor') {
            dispatch(updateRegisterRoleDonor());
        } else if (role === 'volunteer') {
            dispatch(updateRegisterRoleVolunteer());
        }
    }, [role, dispatch]);

    return (
        <>
            <Head>
                <title>Register | Join Nangal by Cycle Community</title>
                <meta name="description" content="Create an account with Nangal by Cycle to participate in our events, access exclusive content, and support our mission. Join our community today." />
            </Head>

            <main id="content" className="site-main">
                <div className="page-header parallaxie">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <div className="page-header-box">
                                    <h1 className="text-anime-style-2" data-cursor="-opaque">
                                        <span>Member</span> Register
                                    </h1>
                                    <nav className="wow fadeInUp">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <Link href="/">Home</Link>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                Register
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row pt-5">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="volunteer-contact-form form_padding_rm">
                                <div className="form_header_img position-relative">
                                    {/* Add your image here */}
                                </div>

                                <div className="form-group header_form_radio mt-5 mb-4 d-flex justify-content-center">
                                    <div className="header_wrapper">
                                        <div
                                            className="form-check form-check-inline no-margin"
                                            style={{ background: registerRoleCheck === RegisterRoles?.Donor ? '#F15B43' : "white" }}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="userType"
                                                id="donor"
                                                style={{ display: 'none' }}
                                                value={RegisterRoles?.Donor}
                                                checked={registerRoleCheck === RegisterRoles?.Donor}
                                                onChange={() => dispatch(updateRegisterRoleDonor())}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="donor"
                                                style={{ color: registerRoleCheck === RegisterRoles?.Donor ? '' : 'black' }}
                                            >
                                                Donor
                                            </label>
                                        </div>

                                        <div
                                            className="form-check form-check-inline no-margin"
                                            style={{ background: registerRoleCheck === RegisterRoles?.Volunteer ? '#F15B43' : "white" }}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="userType"
                                                id="volunteer"
                                                style={{ display: 'none' }}
                                                value={RegisterRoles?.Volunteer}
                                                checked={registerRoleCheck === RegisterRoles?.Volunteer}
                                                onChange={() => dispatch(updateRegisterRoleVolunteer())}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="volunteer"
                                                style={{ color: registerRoleCheck === RegisterRoles?.Volunteer ? '' : 'black' }}
                                            >
                                                Volunteer
                                            </label>
                                        </div>

                                        <div
                                            className="form-check form-check-inline no-margin"
                                            style={{ background: registerRoleCheck === RegisterRoles?.Both ? '#F15B43' : "white" }}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="userType"
                                                id="registerBoth"
                                                style={{ display: 'none' }}
                                                value={RegisterRoles?.Both}
                                                checked={registerRoleCheck === RegisterRoles?.Both}
                                                onChange={() => dispatch(updateRegisterRoleBoth())}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="registerBoth"
                                                style={{ color: registerRoleCheck === RegisterRoles?.Both ? '' : 'black' }}
                                            >
                                                As Both
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <p className="py-4">
                                    Already have an account?{" "}
                                    <a href="/auth/signin" style={{ color: '#F15B43' }}>Sign in</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

// Wrapping Register component with Suspense
const Register = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <RegisterComponent />
    </Suspense>
);

export default Register;
