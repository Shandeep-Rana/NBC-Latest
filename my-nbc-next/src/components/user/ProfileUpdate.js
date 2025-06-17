"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import ReactSelect from "react-select";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getUserInfoFromToken, StatesAndUnionTerritories } from "@/constants";
import { getUserData, updateUser } from "@/Slice/authLogin";
import { getAllIntrests, getAllProfessions, getAllVillages } from "@/Slice/master";
import { updateUserSchema } from "@/lib/FormSchemas";
import AdminLoader from "@/common/AdminLoader";
import Image from "next/image";

function ProfileUpdate() {
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (userInfo) {
            setUserInfo(userInfo)
        };
    }, []);

    const email = userInfo ? userInfo.email : null;

    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [isDelay, setIsDelay] = useState(true);
    const { user, isLoading } = useSelector((state) => state.userLogin);
    const { villages, interests, professions } = useSelector((state) => state.masterSlice);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedProfessionOption, setSelectedProfessionOption] =
        useState(null);

    useEffect(() => {
        dispatch(getUserData(email));
    }, [dispatch, email]);

    useEffect(() => {
        if (user?.userProfile) {
            setPreviewUrl(user.userProfile);
            (async () => {
                try {
                    const res = await fetch(user.userProfile);
                    if (!res.ok) throw new Error("Failed to fetch image");
                    const blob = await res.blob();
                    const file = new File([blob], "userProfile.jpg", { type: blob.type });
                    setFile(file);
                } catch (error) {
                    console.error("Error fetching user profile image:", error.message);
                    setFile(null);
                }
            })();
        }
    }, [user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDelay(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        dispatch(getAllProfessions());
        dispatch(getAllVillages());
        dispatch(getAllIntrests());
    }, [dispatch]);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(updateUserSchema),
    });

    const ProfessionsOptions = professions?.map((profession) => ({
        value: profession.professionName,
        label: profession.professionName,
    }));

    ProfessionsOptions.push({ value: "other", label: "Other" });

    const villageOptions = villages?.map((village) => ({
        value: village.villageName,
        label: village.villageName,
    }));

    villageOptions.push({ value: "other", label: "Other" });

    const handleSelectProfessionChange = (selected) => {
        if (selected?.value === "other") {
            setSelectedProfessionOption("other");
        } else {
            setSelectedProfessionOption(selected?.value);
        }
    };
    const handleSelectChange = (selected) => {
        if (selected?.value === "other") {
            setSelectedOption("other");
        } else {
            setSelectedOption(selected?.value);
        }
    };

    const InterestsOptions = interests?.map((interest) => ({
        value: interest.interest,
        label: interest.interest,
    }));

    const formatDate = (date) => moment(date).format("YYYY-MM-DD");

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("mobile", data?.contact);
        formData.append("dob", formatDate(data?.dob));
        formData.append("gender", data?.gender);
        formData.append("contactMode", data?.preferredContact);
        formData.append("village", data?.village);
        formData.append("addressLine1", data?.addressLine1);
        formData.append("addressLine2", data?.addressLine2);
        formData.append("pincode", data?.pincode);
        formData.append("state", data?.state);
        formData.append("profession", data?.profession);
        formData.append("interests", data?.interests);
        formData.append("about", data?.about);
        formData.append("userProfile", data?.userProfile);
        dispatch(updateUser(userInfo.userId, formData));
    };

    return (
        <>
            {isLoading || isDelay ? (
                <AdminLoader />
            ) : (
                <div id="content">
                    <div className="volunteer-contact-form">
                        <h3>User Details:</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label className="text-left">Full Name <span style={{ color: '#F15B43' }}>*</span></label>
                                    <Controller
                                        name="fullName"
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
                                        defaultValue={user?.name}
                                    />
                                    {errors?.fullName && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.fullName?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label className="text-left">Email <span style={{ color: '#F15B43' }}>*</span></label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                className={`input_fixed_width`}
                                                type="email"
                                                value={email}
                                                onChange={onChange}
                                                autoComplete="false"
                                                disabled
                                                style={{ background: "lightgrey" }}
                                            />
                                        )}
                                        defaultValue={email}
                                    />
                                    {errors?.email && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.email?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label className="text-left">Phone Number <span style={{ color: '#F15B43' }}>*</span></label>
                                    <Controller
                                        name="contact"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <PhoneInput
                                                country={"in"}
                                                value={value}
                                                onChange={(phone) => onChange(phone)}
                                            />
                                        )}
                                        defaultValue={user?.mobile}
                                    />
                                    {errors?.contact && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.contact?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label className="text-left">Date Of Birth <span style={{ color: '#F15B43' }}>*</span></label>
                                    <Controller
                                        name="dob"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <DatePicker
                                                style={{ paddingLeft: 30 }}
                                                showIcon
                                                placeholderText="Date Of Birth"
                                                className={`w-100 input_fixed_width ${errors?.dob ? 'valid_error' : ''}`}
                                                selected={value}
                                                onChange={(date) => {
                                                    if (date) {
                                                        onChange(date);
                                                    } else {
                                                        onChange(null);
                                                    }
                                                }}
                                                icon="fa fa-calendar"
                                                showYearDropdown
                                                isClearable
                                                showMonthDropdown
                                                dropdownMode="select"
                                                openToDate={value ? value : '2000-01-01'}
                                            />
                                        )}
                                        defaultValue={formatDate(user?.dob)}
                                    />
                                    {errors.dob && (
                                        <p style={{ color: "red", textAlign: 'left' }}>{errors?.dob?.message}</p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label className="text-left"> Gender <span style={{ color: "red" }}> *</span></label>
                                    <div className="d-flex form_radio_wrapper_align_center">
                                        <div className="form-check form-check-inline">
                                            <Controller
                                                name="gender"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <input
                                                        id="male"
                                                        className={`form-check-input`}
                                                        style={{ border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                        type="radio"
                                                        value="male"
                                                        checked={value === "male"}
                                                        onChange={() => onChange("male")}
                                                    />
                                                )}
                                                defaultValue={user?.gender}
                                            />
                                            <label
                                                className="form-check-label mr-2"
                                                htmlFor="male"
                                                style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                            >
                                                Male
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <Controller
                                                name="gender"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <input
                                                        style={{ border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                        id="female"
                                                        className={`form-check-input`}
                                                        type="radio"
                                                        value="female"
                                                        checked={value === "female"}
                                                        onChange={() => onChange("female")}
                                                    />
                                                )}
                                                defaultValue={user?.gender}
                                            />
                                            <label
                                                className="form-check-label mr-2"
                                                htmlFor="female"
                                                style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                            >
                                                Female
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <Controller
                                                name="gender"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <input
                                                        id="others"
                                                        className={`form-check-input`}
                                                        style={{ border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                        type="radio"
                                                        value="others"
                                                        checked={value === "others"}
                                                        onChange={() => onChange("others")}
                                                    />
                                                )}
                                                defaultValue={user?.gender}
                                            />
                                            <label
                                                className="form-check-label mr-2"
                                                htmlFor="others"
                                                style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                            >
                                                Others
                                            </label>
                                        </div>
                                    </div>
                                    {errors?.gender && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.gender?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label htmlFor="" className="text-left">
                                        Current Profession <span style={{ color: "#F15B43" }}>*</span>
                                    </label>
                                    {selectedProfessionOption === "other" ? (
                                        <Controller
                                            name="profession"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <input
                                                    type="text"
                                                    placeholder="Enter Current Profession"
                                                    className="input_fixed_width"
                                                    style={{ lineHeight: 5, borderRadius: 6 }}
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                />
                                            )}
                                        />
                                    ) : (
                                        <Controller
                                            name="profession"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <ReactSelect
                                                    placeholder="Current Profession"
                                                    className="selectcustom"
                                                    options={ProfessionsOptions}
                                                    value={ProfessionsOptions.find(
                                                        (option) => option.value === value
                                                    )}
                                                    onChange={(selected) => {
                                                        if (selected?.value !== "other") {
                                                            onChange(selected?.value);
                                                        } else {
                                                            onChange("");
                                                        }
                                                        handleSelectProfessionChange(selected);
                                                    }}
                                                    isClearable
                                                    isSearchable
                                                    styles={{
                                                        control: (provided, state) => ({
                                                            ...provided,
                                                            border: errors?.profession
                                                                ? "1px solid red"
                                                                : "1px solid #B8BDC9",
                                                            backgroundColor: "white",
                                                            minHeight: 45,
                                                            height: 45,
                                                            boxShadow: state.isFocused
                                                                ? "0 0 0 2px transparent"
                                                                : provided.boxShadow,
                                                            "&:hover": {
                                                                border: errors?.profession
                                                                    ? "1px solid red"
                                                                    : "1px solid #B8BDC9",
                                                            },
                                                            display: "flex",
                                                        }),
                                                        valueContainer: (provided) => ({
                                                            ...provided,
                                                            height: 45,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            padding: "0 15px",
                                                        }),
                                                        input: (provided) => ({
                                                            ...provided,
                                                            margin: 0,
                                                            padding: 0,
                                                        }),
                                                        indicatorsContainer: (provided) => ({
                                                            ...provided,
                                                            height: 45,
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }),
                                                        placeholder: (provided) => ({
                                                            ...provided,
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }),
                                                    }}
                                                />
                                            )}
                                            defaultValue={user?.profession}
                                        />
                                    )}
                                    {errors?.profession && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.profession?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label htmlFor="" className="text-left">Interests/Area of Expertise <span style={{ color: '#F15B43' }}>*</span></label>
                                    <Controller
                                        name="interests"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <ReactSelect
                                                className="selectcustom"
                                                options={InterestsOptions}
                                                value={InterestsOptions.find(
                                                    (option) => option.value === value
                                                )}
                                                onChange={(selected) => onChange(selected?.value)}
                                                isClearable
                                                isSearchable
                                                styles={{
                                                    control: (provided, state) => ({
                                                        ...provided,
                                                        border: errors?.profession ? "1px solid red" : "1px solid #B8BDC9",
                                                        backgroundColor: 'white',
                                                        minHeight: 45,
                                                        height: 45,
                                                        boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                        '&:hover': {
                                                            border: errors?.profession ? "1px solid red" : "1px solid #B8BDC9",
                                                        },
                                                        display: 'flex',
                                                    }),
                                                    valueContainer: (provided) => ({
                                                        ...provided,
                                                        height: 45,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '0 15px',
                                                    }),
                                                    input: (provided) => ({
                                                        ...provided,
                                                        margin: 0,
                                                        padding: 0,
                                                    }),
                                                    indicatorsContainer: (provided) => ({
                                                        ...provided,
                                                        height: 45,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }),
                                                    placeholder: (provided) => ({
                                                        ...provided,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }),
                                                }}
                                            />
                                        )}
                                        defaultValue={user?.interests}
                                    />
                                    {errors?.interests && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.interests?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label htmlFor="" className="text-left">About</label>
                                    <Controller
                                        name="about"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <textarea
                                                className={`input_fixed_width ${errors?.about ? 'valid_error' : ''}`}
                                                type="text"
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                        defaultValue={user?.about || ""}
                                    />
                                    {errors?.about && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.about?.message}
                                        </p>
                                    )}
                                </div>
                                <h3>Address Details:</h3>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label htmlFor="" className="text-left">Address Line 1 <span style={{ color: '#F15B43' }}>*</span></label>
                                    <Controller
                                        name="addressLine1"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <textarea
                                                className={`input_fixed_width ${errors?.addressLine1 ? 'valid_error' : ''}`}
                                                type="text"
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                        defaultValue={user?.addressLine1 || ""}
                                    />
                                    {errors?.addressLine1 && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.addressLine1?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label htmlFor="" className="text-left">Address Line 2</label>
                                    <Controller
                                        name="addressLine2"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <textarea
                                                className={`input_fixed_width ${errors?.addressLine2 ? 'valid_error' : ''}`}
                                                type="text"
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                        defaultValue={user?.addressLine2 || ""}
                                    />
                                    {errors?.addressLine2 && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.addressLine2?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label htmlFor="" className="text-left">Pin Code <span style={{ color: '#F15B43' }}>*</span></label>
                                    <Controller
                                        name="pincode"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                className={`input_fixed_width ${errors?.pincode ? 'valid_error' : ''}`}
                                                type="text"
                                                value={value}
                                                onChange={onChange}
                                                maxLength={6}
                                            />
                                        )}
                                        defaultValue={user?.pincode}
                                    />
                                    {errors.pincode && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors.pincode.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label htmlFor="" className="text-left">State <span style={{ color: '#F15B43' }}>*</span></label>
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <ReactSelect
                                                className="selectcustom"
                                                options={StatesAndUnionTerritories}
                                                value={StatesAndUnionTerritories.find(
                                                    (option) => option.value === value
                                                )}
                                                onChange={(selected) => onChange(selected?.value)}
                                                isClearable
                                                isSearchable
                                                styles={{
                                                    control: (provided, state) => ({
                                                        ...provided,
                                                        border: errors?.profession ? "1px solid red" : "1px solid #B8BDC9",
                                                        backgroundColor: 'white',
                                                        minHeight: 45,
                                                        height: 45,
                                                        boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                        '&:hover': {
                                                            border: errors?.profession ? "1px solid red" : "1px solid #B8BDC9",
                                                        },
                                                        display: 'flex',
                                                    }),
                                                    valueContainer: (provided) => ({
                                                        ...provided,
                                                        height: 45,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '0 15px',
                                                    }),
                                                    input: (provided) => ({
                                                        ...provided,
                                                        margin: 0,
                                                        padding: 0,
                                                    }),
                                                    indicatorsContainer: (provided) => ({
                                                        ...provided,
                                                        height: 45,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }),
                                                    placeholder: (provided) => ({
                                                        ...provided,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }),
                                                }}
                                            />
                                        )}
                                        defaultValue={user?.state}
                                    />
                                    {errors.state && (
                                        <p style={{ color: "red", textAlign: 'left' }}>{errors.state.message}</p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label htmlFor="" className="text-left">
                                        City/Village <span style={{ color: "#F15B43" }}>*</span>
                                    </label>
                                    {selectedOption === "other" ? (
                                        <Controller
                                            name="village"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <input
                                                    className="input_fixed_width"
                                                    type="text"
                                                    placeholder="City/Village"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                />
                                            )}
                                        />
                                    ) : (
                                        <Controller
                                            name="village"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <ReactSelect
                                                    className="selectcustom"
                                                    placeholder="Village/City"
                                                    options={villageOptions}
                                                    value={villageOptions.find(
                                                        (option) => option.value === value
                                                    )}
                                                    onChange={(selected) => {
                                                        if (selected?.value !== "other") {
                                                            onChange(selected?.value);
                                                        } else {
                                                            onChange("");
                                                        }
                                                        handleSelectChange(selected);
                                                    }}
                                                    isClearable
                                                    isSearchable
                                                    styles={{
                                                        control: (provided, state) => ({
                                                            ...provided,
                                                            border: errors?.village
                                                                ? "1px solid red"
                                                                : "1px solid #B8BDC9",
                                                            backgroundColor: "white",
                                                            minHeight: 45,
                                                            height: 45,
                                                            boxShadow: state.isFocused
                                                                ? "0 0 0 2px transparent"
                                                                : provided.boxShadow,
                                                            "&:hover": {
                                                                border: errors?.village
                                                                    ? "1px solid red"
                                                                    : "1px solid #B8BDC9",
                                                            },
                                                            display: "flex",
                                                        }),
                                                        valueContainer: (provided) => ({
                                                            ...provided,
                                                            height: 45,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            padding: "0 15px",
                                                        }),
                                                        input: (provided) => ({
                                                            ...provided,
                                                            margin: 0,
                                                            padding: 0,
                                                        }),
                                                        indicatorsContainer: (provided) => ({
                                                            ...provided,
                                                            height: 45,
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }),
                                                        placeholder: (provided) => ({
                                                            ...provided,
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }),
                                                    }}
                                                />
                                            )}
                                            defaultValue={user?.village}
                                        />
                                    )}
                                    {errors.village && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors.village.message}
                                        </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                                    <div className="mb-2" style={{ fontWeight: 500 }}>Profile Photo <span style={{ color: 'red' }}>*</span></div>
                                    <label htmlFor="userProfile" className="input_fixed_width" style={{ lineHeight: '40px' }}>Upload Photo</label>
                                    <Controller
                                        name="userProfile"
                                        control={control}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <>
                                                <input
                                                    id="userProfile"
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file && file.type.startsWith("image/")) {
                                                            const previewUrl = URL.createObjectURL(file);
                                                            setPreviewUrl(previewUrl);
                                                            onChange(file);
                                                        }
                                                    }}
                                                    onBlur={onBlur}
                                                    accept=".jpg,.jpeg,.png"
                                                />
                                            </>
                                        )}
                                        defaultValue={file}
                                    />
                                    {previewUrl && (
                                        <div className="preview-image-container" style={{ width: 310, height: 'auto', position: 'relative' }}>
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                className="preview-image"
                                                style={{ objectFit: 'contain' }}
                                                unoptimized // ⚠️ Required for blob/base64/image previews
                                            />
                                        </div>
                                    )}
                                    {errors?.userProfile && (
                                        <div style={{ color: "red", textAlign: 'left' }}>{errors?.userProfile?.message}</div>
                                    )}
                                </div>
                                {/* <h3>Additional Details:</h3> */}
                                {/* <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label htmlFor="" className="text-left">Additional Comments</label>
                                    <Controller
                                        name="additionalComments"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <textarea
                                                className={`input_fixed_width ${errors?.additionalComments ? 'valid_error' : ''}`}
                                                type="text"
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                        defaultValue={user?.comment || ""}
                                    />
                                    {errors?.additionalComments && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors?.additionalComments?.message}
                                        </p>
                                    )}
                                </div> */}
                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                    <label className="text-left">Mode of Contact <span style={{ color: "red" }}> *</span></label>
                                    <div className="d-flex form_radio_wrapper_align_center">
                                        <div className="form-check form-check-inline">
                                            <Controller
                                                name="preferredContact"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <input
                                                        style={{ border: errors?.preferredContact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                        id="email"
                                                        className={`form-check-input`}
                                                        type="radio"
                                                        value="email"
                                                        checked={value === "email"}
                                                        onChange={() => onChange("email")}
                                                    />
                                                )}
                                                defaultValue={user?.contactMode}
                                            />
                                            <label
                                                className="form-check-label mr-2"
                                                htmlFor="email"
                                                style={{ color: errors?.preferredContact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                            >
                                                E-mail
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <Controller
                                                name="preferredContact"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <input
                                                        style={{ border: errors?.preferredContact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                        id="contact"
                                                        className={`form-check-input`}
                                                        type="radio"
                                                        value="contact"
                                                        checked={value === "contact"}
                                                        onChange={() => onChange("contact")}
                                                    />
                                                )}
                                                defaultValue={user?.contactMode}
                                            />
                                            <label
                                                className="form-check-label mr-2"
                                                htmlFor="contact"
                                                style={{ color: errors?.preferredContact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                            >
                                                Phone
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <Controller
                                                name="preferredContact"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <input
                                                        style={{ border: errors?.preferredContact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                        id="both"
                                                        className={`form-check-input`}
                                                        type="radio"
                                                        value="both"
                                                        checked={value === "both"}
                                                        onChange={() => onChange("both")}
                                                    />
                                                )}
                                                defaultValue={user?.contactMode}
                                            />
                                            <label className="form-check-label mr-2" htmlFor="both" style={{ color: errors?.preferredContact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                                                Both
                                            </label>
                                        </div>
                                    </div>
                                    {errors.preferredContact && (
                                        <p style={{ color: "red", textAlign: 'left' }}>
                                            {errors.preferredContact.message}
                                        </p>
                                    )}
                                </div>
                                <div className="submit-area col-lg-12 col-12">
                                    <button type="submit" className="button-round">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProfileUpdate;