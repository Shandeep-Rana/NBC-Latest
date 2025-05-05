"use client";

import { getAllIntrests, getAllProfessions, getAllVillages } from '@/Slice/master';
import { adduser } from '@/Slice/volunteers';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from "react-select";
import PhoneInput from 'react-phone-input-2';
import DatePicker from 'react-datepicker';
import Loader from '@/common/Loader';
import { StatesAndUnionTerritories } from '@/constants';
import { volunteerSchema } from '@/lib/FormSchemas';
import Link from 'next/link';
import Image from 'next/image';

const AddVolunteer = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState("");
    const { villages, interests, professions, isLoading } = useSelector(
        (state) => state.masterSlice
    );
    const { isLoading: isUserLoading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllProfessions());
        dispatch(getAllVillages());
        dispatch(getAllIntrests());
    }, [dispatch]);

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

    const InterestsOptions = interests?.map((interest) => ({
        value: interest.name,
        label: interest.name,
    }));
    InterestsOptions.push({ value: "other", label: "Other" });

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedProfessionOption, setSelectedProfessionOption] =
        useState(null);
    const [selectedIntrestOption, setSelectedIntrestOption] = useState(null);

    const handleSelectIntrestChange = (selected) => {
        if (selected?.value === "other") {
            setSelectedIntrestOption("other");
        } else {
            setSelectedIntrestOption(selected?.value);
        }
    };

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

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(volunteerSchema),
    });


    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD");
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email.toLowerCase());
        formData.append("password", data?.password);
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
        formData.append("userProfile", data?.userProfile);
        dispatch(adduser(formData, navigate, reset));
        setPreviewUrl();
    };
    const dateFormat = 'YYYY/MM/DD';

    return (
        <div id="content">
            {isLoading || isUserLoading ? (
                <Loader />
            ) : (
                <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-10">
                        <div className="row my-4">
                            <div className="text-center">
                                <h3>Add Volunteer</h3>
                            </div>
                            <div className="card-body pt-0">
                                <div className="volunteer-contact-form">
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="volunteer-form"
                                    >
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Full Name <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="fullName"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            placeholder="Full Name"
                                                            className={`input_fixed_width ${errors?.fullName ? 'valid_error' : ''}`}
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            autoComplete="false"
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.fullName && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.fullName?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Email Address <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            placeholder="Email Address"
                                                            className={`input_fixed_width ${errors?.email ? 'valid_error' : ''}`}
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.email && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.email?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label htmlFor="" className="text-left">
                                                    Date Of Birth <span style={{ fontSize: 12, color: '#9d9d9d' }}>(YYYY-MM-DD)</span><span style={{ color: '#F15B43' }}>  *</span>
                                                </label>
                                                <Controller
                                                    name="donorDOB"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <DatePicker
                                                            showIcon
                                                            placeholderText="Date Of Birth"
                                                            className={`w-100 input_fixed_width ${errors?.donorDOB ? 'valid_error' : ''}`}
                                                            selected={value ? parseISO(value) : null}
                                                            style={{ height: 45, border: '1px solid #B8BDC9', borderRadius: '6px', overflow: 'hidden', lineHeight: '4px' }}
                                                            onChange={(date) => {
                                                                if (date && moment(date).isValid()) {
                                                                    onChange(format(date, dateFormat));
                                                                } else {
                                                                    onChange(null);
                                                                }
                                                            }}
                                                            icon="fa fa-calendar"
                                                            isClearable
                                                            dateFormat={dateFormat}
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            dropdownMode="select"
                                                            openToDate={value ? parseISO(value) : new Date('2000-01-01')}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.donorDOB && (
                                                    <div style={{ color: 'red' }} className="text-left">
                                                        {errors?.donorDOB.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Phone <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="contact"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <PhoneInput
                                                            country={"in"}
                                                            value={value}
                                                            className={`${errors?.contact ? 'valid_error' : ''}`}
                                                            onChange={(phone) => onChange(phone)}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.contact && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.contact?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Password <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="password"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            placeholder="Password"
                                                            type="password"
                                                            value={value}
                                                            onChange={onChange}
                                                            className={`input_fixed_width ${errors?.password ? 'valid_error' : ''}`}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.password && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {" "}
                                                        {errors?.password?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Confirm Password <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="cpassword"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            placeholder="Confirm Password"
                                                            type="password"
                                                            value={value}
                                                            onChange={onChange}
                                                            className={`input_fixed_width ${errors?.cpassword ? 'valid_error' : ''}`}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.cpassword && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {" "}
                                                        {errors?.cpassword?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="mb-2 text-left">Gender <span style={{ color: '#F15B43' }}>*</span></label>
                                                <div className="d-flex justify-content-start form_radio_wrapper_align_center">
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
                                                                    id="female"
                                                                    className={`form-check-input`}
                                                                    type="radio"
                                                                    value="female"
                                                                    checked={value === "female"}
                                                                    onChange={() => onChange("female")}
                                                                    style={{ border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                />
                                                            )}
                                                        />
                                                        <label
                                                            className="form-check-label"
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
                                                                    type="radio"
                                                                    value="others"
                                                                    checked={value === "others"}
                                                                    onChange={() => onChange("others")}
                                                                    style={{ border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                />
                                                            )}
                                                        />
                                                        <label
                                                            className="form-check-label mb-2"
                                                            htmlFor="others"
                                                            style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}

                                                        >
                                                            Others
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors?.gender && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.gender?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="mb-2 text-left">Current Profession <span style={{ color: 'red' }}>*</span></label>
                                                {selectedProfessionOption === "other" ? (
                                                    <Controller
                                                        name="profession"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Current Profession"
                                                                className="input_fixed_width"
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
                                                                className="selectcustom"
                                                                placeholder="Current Profession"
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
                                                                isFocused={false}
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
                                                        defaultValue=""
                                                    />
                                                )}
                                                {errors?.profession && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.profession?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                                                <div style={{ color: '#383838', fontWeight: 500 }} className="mb-2">Profile Picture <span style={{ color: 'red' }}>*</span> </div>
                                                <label htmlFor="userProfile"
                                                    className={`input_fixed_width`}
                                                    style={{
                                                        border: errors?.userProfile ? "1px solid red" : "1px solid #B8BDC9",
                                                    }} >Profile Picture</label>
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
                                                                        const previewUrl =
                                                                            URL.createObjectURL(file);
                                                                        setPreviewUrl(previewUrl);
                                                                        onChange(file);
                                                                    }
                                                                }}
                                                                onBlur={onBlur}
                                                                accept=".jpg,.png,.jpeg"
                                                            />
                                                            {previewUrl && (
                                                                <div className="preview-image-container" style={{ position: 'relative', width: '300px', height: '200px' }}>
                                                                    <Image
                                                                        src={previewUrl}
                                                                        alt="Preview"
                                                                        fill
                                                                        className="preview-image"
                                                                        style={{ objectFit: 'contain' }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                />
                                                {errors.userProfile && (
                                                    <span className="error-message" style={{ color: 'red' }}>
                                                        {errors.userProfile.message}
                                                    </span>
                                                )}
                                            </div>
                                            <h3>Address Details:</h3>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="mb-2 text-left">Address Line 1 <span style={{ color: 'red' }}>*</span></label>
                                                <Controller
                                                    name="addressLine1"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <textarea
                                                            placeholder="Address Line 1"
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            className={`input_fixed_width ${errors?.addressLine1 ? 'valid_error' : ''}`}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.addressLine1 && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.addressLine1?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="mb-2 text-left">   Address Line 2 </label>
                                                <Controller
                                                    name="addressLine2"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <textarea
                                                            placeholder="Address Line 2"
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            className={`input_fixed_width`}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Pin Code <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="pincode"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            placeholder="Pin Code"
                                                            type="text"
                                                            maxLength={6}
                                                            value={value}
                                                            onChange={onChange}
                                                            className={`input_fixed_width ${errors?.pincode ? 'valid_error' : ''}`}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors.pincode && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors.pincode.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">State <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="state"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <ReactSelect
                                                            className="selectcustom"
                                                            placeholder="State"
                                                            options={StatesAndUnionTerritories}
                                                            value={StatesAndUnionTerritories.find(
                                                                (option) => option.value === value
                                                            )}
                                                            onChange={(selected) => onChange(selected?.value)}
                                                            isClearable
                                                            isSearchable
                                                            isFocused={false}
                                                            styles={{
                                                                control: (provided, state) => ({
                                                                    ...provided,
                                                                    border: errors?.state ? "1px solid red" : "1px solid #B8BDC9",
                                                                    backgroundColor: 'white',
                                                                    minHeight: 45,
                                                                    height: 45,
                                                                    boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                                    '&:hover': {
                                                                        border: errors?.state ? "1px solid red" : "1px solid #B8BDC9",
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
                                                    defaultValue=""
                                                />
                                                {errors.state && (
                                                    <div style={{ color: "red" }} className="text-left"> {errors.state.message}</div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Village/City </label>

                                                {selectedOption === "other" ? (
                                                    <Controller
                                                        name="village"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Village/City"
                                                                className="input_fixed_width"
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
                                                                isFocused={false}
                                                                styles={{
                                                                    control: (provided, state) => ({
                                                                        ...provided,
                                                                        border: errors?.village ? "1px solid red" : "1px solid #B8BDC9",
                                                                        backgroundColor: 'white',
                                                                        minHeight: 45,
                                                                        height: 45,
                                                                        boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                                        '&:hover': {
                                                                            border: errors?.village ? "1px solid red" : "1px solid #B8BDC9",
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
                                                        defaultValue=""
                                                    />
                                                )}
                                                {errors?.village && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.village?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="mb-2 text-left">Mode of Contact <span style={{ color: 'red' }}>*</span> </label>
                                                <div className="d-flex justify-content-start form_radio_wrapper_align_center">
                                                    <div className="form-check form-check-inline">
                                                        <Controller
                                                            name="preferredContact"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    id="email"
                                                                    style={{ border: errors?.preferredContact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                    className={`form-check-input`}
                                                                    type="radio"
                                                                    value="email"
                                                                    checked={value === "email"}
                                                                    onChange={() => onChange("email")}
                                                                />
                                                            )}
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
                                                                    id="contact"
                                                                    className={`form-check-input`}
                                                                    style={{ border: errors?.preferredContact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                    type="radio"
                                                                    value="contact"
                                                                    checked={value === "contact"}
                                                                    onChange={() => onChange("contact")}
                                                                />
                                                            )}
                                                        />
                                                        <label
                                                            className="form-check-label"
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
                                                                    id="both"
                                                                    className={`form-check-input`}
                                                                    style={{ border: errors?.preferredContact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                    type="radio"
                                                                    value="both"
                                                                    checked={value === "both"}
                                                                    onChange={() => onChange("both")}
                                                                />
                                                            )}
                                                        />
                                                        <label className="form-check-label" htmlFor="both"
                                                            style={{ color: errors?.preferredContact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                                        >
                                                            Both
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors.preferredContact && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors.preferredContact.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="submit-area col-lg-12 col-12">
                                                <Link href="/admin/volunteer/volunteerlist" className="button-round button-back">
                                                    Back to List
                                                </Link>
                                                <button type="submit" className="button-round">
                                                    Add Volunteer
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )}
        </div >
    )
}

export default AddVolunteer