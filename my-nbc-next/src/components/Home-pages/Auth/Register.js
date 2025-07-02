'use client';

import React, { useEffect } from "react";
import Image from 'next/image';
import { useDispatch, useSelector } from "react-redux";
import Head from 'next/head';
import Link from 'next/link';
import { RegisterRoles } from "@/constants";
import { updateRegisterRoleBoth, updateRegisterRoleDonor, updateRegisterRoleVolunteer } from "@/Slice/master";
import RegisterAsBoth from "./Register-Forms/RegisterAsBoth";
import RegisterDonor from "./Register-Forms/RegisterDonor";
import RegisterVolunteer from "./Register-Forms/RegisterVolunteer";

// ✅ Use string path for background image
const registerimg = '/images/registerimg.jpg';

const Register = ({ role }) => {
    const dispatch = useDispatch();
    const { registerRoleCheck } = useSelector(state => state.masterSlice);

    useEffect(() => {
        if (role === 'donor') {
            dispatch(updateRegisterRoleDonor());
        } else if (role === 'volunteer') {
            dispatch(updateRegisterRoleVolunteer());
        }
    }, [role, dispatch]);

    const renderHeaderImage = () => {
        switch (registerRoleCheck) {
            case RegisterRoles.Donor:
                return '/Images/donor-header-img.jpeg';
            case RegisterRoles.Volunteer:
                return '/Images/Volunteers-working-together-1.jpg';
            case RegisterRoles.Both:
                return '/Images/photo.jpg';
            default:
                return '';
        }
    };

    return (
        <>
            <Head>
                <title>Register | Join Nangal by Cycle Community</title>
                <meta
                    name="description"
                    content="Create an account with Nangal by Cycle to participate in our events, access exclusive content, and support our mission. Join our community today."
                />
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

                {/* ✅ Corrected background image */}
                <div className="volunteer-wrap" style={{ backgroundImage: `url(${registerimg})` }}>
                    <div className="container">
                        <div className="row pt-5">
                            <div className="col-lg-8 offset-lg-2">
                                <div className="volunteer-contact-form form_padding_rm">
                                    <div className="form_header_img position-relative">
                                        {renderHeaderImage() && (
                                            <Image
                                                src={renderHeaderImage()}
                                                alt="Header Role Image"
                                                layout="responsive"
                                                width={1200}
                                                height={400}
                                                objectFit="cover"
                                                priority
                                            />
                                        )}
                                        <div className="position-absolute header_img_title">
                                            <h1 className="main_title text-center">
                                                Register As <br />
                                                {registerRoleCheck === RegisterRoles.Donor
                                                    ? 'DONOR'
                                                    : registerRoleCheck === RegisterRoles.Volunteer
                                                    ? 'VOLUNTEER'
                                                    : registerRoleCheck === RegisterRoles.Both
                                                    ? 'BOTH'
                                                    : ''}
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="form-group header_form_radio mt-5 mb-4 d-flex justify-content-center">
                                        <div className="header_wrapper">
                                            {['Donor', 'Volunteer', 'Both'].map((roleKey) => {
                                                const isSelected = registerRoleCheck === RegisterRoles[roleKey];
                                                const updateRole = {
                                                    Donor: updateRegisterRoleDonor,
                                                    Volunteer: updateRegisterRoleVolunteer,
                                                    Both: updateRegisterRoleBoth,
                                                }[roleKey];

                                                return (
                                                    <div
                                                        key={roleKey}
                                                        className="form-check form-check-inline no-margin"
                                                        style={{ background: isSelected ? '#F15B43' : 'white' }}
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="userType"
                                                            id={roleKey.toLowerCase()}
                                                            style={{ display: 'none' }}
                                                            checked={isSelected}
                                                            onChange={() => dispatch(updateRole())}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={roleKey.toLowerCase()}
                                                            style={{ color: isSelected ? '' : 'black' }}
                                                        >
                                                            {roleKey === 'Both' ? 'As Both' : roleKey}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {registerRoleCheck === RegisterRoles.Donor ? (
                                        <RegisterDonor />
                                    ) : registerRoleCheck === RegisterRoles.Volunteer ? (
                                        <RegisterVolunteer />
                                    ) : registerRoleCheck === RegisterRoles.Both ? (
                                        <RegisterAsBoth />
                                    ) : null}

                                    <p className="py-4">
                                        Already have an account?{' '}
                                        <Link href="/auth/signin" style={{ color: '#F15B43' }}>
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Register;
