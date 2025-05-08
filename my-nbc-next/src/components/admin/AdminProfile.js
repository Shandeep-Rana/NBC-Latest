"use client";

import { getUserInfoFromToken } from '@/constants';
import { getUserData } from '@/Slice/authLogin';
import { getAllIntrests, getAllProfessions, getAllVillages } from '@/Slice/master';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from "yup";
import AdminLoader from '@/common/AdminLoader';

const schema = yup.object({
    fullName: yup.string().required("Name is required").trim(),
    email: yup.string().required("Email is required").trim(),
});

const AdminProfile = () => {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.userLogin);
    const [userInfo, setUserInfo] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            const info = getUserInfoFromToken();
            setUserInfo(info);
        }
    }, []);

    useEffect(() => {
        if (userInfo?.email) {
            dispatch(getUserData(userInfo.email));
            setFormData(prev => ({
                ...prev,
                email: userInfo.email
            }));
        }
    }, [dispatch, userInfo]);

    useEffect(() => {
        dispatch(getAllProfessions());
        dispatch(getAllVillages());
        dispatch(getAllIntrests());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || "",
            }));
        }
    }, [user]);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        try {
            await schema.validateAt(name, { [name]: value });
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        } catch (error) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await schema.validate(formData, { abortEarly: false });
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.fullName);
            dispatch(updateAdminDetails(userInfo?.userId, formDataToSend, formData.email));
        } catch (validationErrors) {
            const newErrors = {};
            validationErrors.inner.forEach((error) => {
                newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
        }
    };

    return (
        <>
            {isLoading && <AdminLoader />}
            <div id="content" style={{ position: "relative", opacity: isLoading ? 0.5 : 1 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-8">
                        <div className="row my-4 justify-content-center">
                            <div className="columns col-md-12 col-lg-12 col-12 mb-4 mb-md-0">
                                <div className="card-body pt-0">
                                    <div className="volunteer-contact-form">
                                        <h3>User Details:</h3>
                                        <form onSubmit={onSubmit} className="volunteer-form">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                                                    <label className="text-left">Name <span style={{ color: '#F15B43' }}>*</span></label>
                                                    <input
                                                        className={`form-control ${errors?.fullName ? 'is-invalid' : ''}`}
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleInputChange}
                                                        autoComplete="off"
                                                    />
                                                    {errors?.fullName && (
                                                        <div className="invalid-feedback">
                                                            {errors.fullName}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                                                    <label className="text-left">Email <span style={{ color: '#F15B43' }}>*</span></label>
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        autoComplete="off"
                                                        disabled
                                                        style={{ background: "lightgray" }}
                                                    />
                                                    {errors?.email && (
                                                        <div className="invalid-feedback">
                                                            {errors.email}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-12 text-center">
                                                    <button type="submit" className="btn btn-primary mt-3">
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
    
                            <div className="columns col-md-12 col-lg-12 col-12 mt-4">
                                <div className="card p-5">
                                    <div className="sidebar">
                                        <aside className="widget author_widget">
                                            <div className="widget-content text-center">
                                                <div className="profile">
                                                    <figure className="avatar">
                                                        {user?.userProfile && (
                                                            <Image
                                                                src={user.userProfile}
                                                                alt="User Profile"
                                                                width={120}
                                                                height={120}
                                                                className="rounded-circle"
                                                            />
                                                        )}
                                                    </figure>
                                                    <div className="text-content">
                                                        <div className="name-title">
                                                            <h3>
                                                                <Link href={"#"}>{user?.name}</Link>
                                                            </h3>
                                                        </div>
                                                        <p>Email: {user?.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </aside>
                                    </div>
                                </div>
                            </div>
    
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
F    
};

export default AdminProfile;
