"use client"

import Loader from '@/common/Loader';
import { BloodGroupOptions, StatesAndUnionTerritories } from '@/constants';
import { donorSchema } from '@/lib/FormSchemas';
import { addDonor } from '@/Slice/bloodDonation';
import { getAllVillages } from '@/Slice/master';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from "react-select";

const AddDonor = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const [previewUrl, setPreviewUrl] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const { villages } = useSelector((state) => state.masterSlice);
    const { isLoading } = useSelector((state) => state.donor);

    const villageOptions = villages?.map((village) => ({
        value: village.villageName,
        label: village.villageName,
    }));
    villageOptions.push({ value: "other", label: "Other" });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(donorSchema),
    });

    const handleSelectChange = (selected) => {
        if (selected?.value === "other") {
            setSelectedOption("other");
        } else {
            setSelectedOption(selected?.value);
        }
    };

    const formatDate = (date) => moment(date).format("YYYY-MM-DD");

    const onSubmit = (data) => {
        const dobDate = new Date(data?.dob);
        const formData = new FormData();
        formData.append("fullName", data?.fullName);
        formData.append("email", data?.email.toLowerCase());
        formData.append("mobile", data?.contact);
        formData.append("dob", formatDate(dobDate));
        formData.append("bloodType", data?.bloodType);
        formData.append("gender", data?.gender);
        formData.append("village", data?.village);
        formData.append("pincode", data?.pincode);
        formData.append("state", data?.stateOption);
        formData.append("addressLine1", data?.addressline1);
        formData.append("addressLine2", data?.addressline2);
        formData.append("contactMode", data?.modeofcontact);
        formData.append("medical_history", data?.medicalHistory);
        formData.append("userProfile", data?.donorProfile);
        dispatch(addDonor(formData, navigate, reset, setPreviewUrl));
    };

    useEffect(() => {
        dispatch(getAllVillages());
    }, [dispatch]);
    const dateFormat = 'YYYY/MM/DD';


    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div id="content">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 col-md-10">
                            <div className="row my-4">
                                <div className="text-center">
                                    <h3>Add Donor</h3>
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
                                                                className={`input_fixed_width ${errors?.fullName ? 'valid_error' : ''}`}
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                                autoComplete="false"
                                                                placeholder="Full Name"
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
                                                                className={`input_fixed_width ${errors?.email ? 'valid_error' : ''}`}
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                                placeholder="Email Address"
                                                            />
                                                        )}
                                                        defaultValue=""
                                                    />
                                                    {errors?.email && (
                                                        <div style={{ color: "red" }} className="text-left">{errors?.email?.message}</div>
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
                                                    <label className="text-left">Phone Number <span style={{ color: '#F15B43' }}>*</span></label>
                                                    <Controller
                                                        name="contact"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <PhoneInput
                                                                country={"in"}
                                                                value={value}
                                                                className={`${errors?.contact ? 'valid_error' : ''}`}
                                                                onChange={(phone) => onChange(phone)}
                                                                style={{ border: errors?.contact ? '1px solid red' : "" }}
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
                                                    <label className="text-left">Blood Group <span style={{ color: '#F15B43' }}>*</span></label>
                                                    <Controller
                                                        name="bloodType"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <ReactSelect
                                                                className="selectcustom"
                                                                options={BloodGroupOptions}
                                                                value={BloodGroupOptions.find(
                                                                    (option) => option.value === value
                                                                )}
                                                                onChange={(selected) => onChange(selected?.value)}
                                                                isClearable
                                                                isSearchable
                                                                isFocused={false}
                                                                styles={{
                                                                    control: (provided, state) => ({
                                                                        ...provided,
                                                                        border: errors?.bloodType ? "1px solid red" : "1px solid #B8BDC9",
                                                                        backgroundColor: 'white',
                                                                        minHeight: 45,
                                                                        height: 45,
                                                                        boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                                        '&:hover': {
                                                                            border: errors?.bloodType ? "1px solid red" : "1px solid #B8BDC9",
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
                                                    {errors?.bloodType && (
                                                        <div style={{ color: "red" }} className="text-left">
                                                            {errors?.bloodType?.message}
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
                                                                        style={{ border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                        className={`form-check-input`}
                                                                        type="radio"
                                                                        value="male"
                                                                        checked={value === "male"}
                                                                        onChange={() => onChange("male")}
                                                                    />
                                                                )}
                                                            />
                                                            <label className={`form-check-label mr-2`} style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="male">
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
                                                                        style={{ border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                        type="radio"
                                                                        value="female"
                                                                        checked={value === "female"}
                                                                        onChange={() => onChange("female")}
                                                                    />
                                                                )}
                                                            />
                                                            <label className={`form-check-label mr-2`} style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="female">
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
                                                            />
                                                            <label
                                                                className={`form-check-label mr-2`} style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                                                htmlFor="others"
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
                                                    <label className="text-left">Address Line 1 <span style={{ color: '#F15B43' }}>*</span></label>
                                                    <Controller
                                                        name="addressline1"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <textarea
                                                                className={`input_fixed_width ${errors?.addressline1 ? 'valid_error' : ''}`}
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                            />
                                                        )}
                                                        defaultValue=""
                                                    />
                                                    {errors?.addressline1 && (
                                                        <div style={{ color: "red" }} className="text-left">
                                                            {errors?.addressline1?.message}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                    <label className="text-left">Address Line 2</label>
                                                    <Controller
                                                        name="addressline2"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <textarea
                                                                className={`input_fixed_width`}
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
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
                                                                className={`input_fixed_width ${errors?.pincode ? 'valid_error' : ''}`}
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                                maxLength={6}
                                                                placeholder="Pin Code"
                                                            />
                                                        )}
                                                        defaultValue=""
                                                    />
                                                    {errors.pincode && (
                                                        <div style={{ color: "red" }} className="text-left">{errors.pincode.message}</div>
                                                    )}
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                    <label className="text-left">State <span style={{ color: '#F15B43' }}>*</span></label>
                                                    <Controller
                                                        name="stateOption"
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
                                                                isFocused={false}
                                                                styles={{
                                                                    control: (provided, state) => ({
                                                                        ...provided,
                                                                        border: errors?.stateOption ? "1px solid red" : "1px solid #B8BDC9",
                                                                        backgroundColor: 'white',
                                                                        minHeight: 45,
                                                                        height: 45,
                                                                        boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                                        '&:hover': {
                                                                            border: errors?.stateOption ? "1px solid red" : "1px solid #B8BDC9",
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
                                                    {errors.stateOption && (
                                                        <div style={{ color: "red" }} className="text-left">
                                                            {errors.stateOption.message}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                    <label className="text-left">Village/City <span style={{ color: '#F15B43' }}>*</span></label>
                                                    {selectedOption === "other" ? (
                                                        <Controller
                                                            name="village"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    className={`input_fixed_width`}
                                                                    type="text"
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
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                                                    <div className="mb-2 profile-photo-class">Profile Photo <span style={{ color: 'red' }}>*</span></div>
                                                    <label htmlFor="donorProfile" className="input_fixed_width" style={{ lineHeight: 3, border: errors.donorProfile ? '1px solid red' : '1px solid #B8BDC9' }}>Upload Photo</label>
                                                    <Controller
                                                        name="donorProfile"
                                                        control={control}
                                                        render={({ field: { value, onChange, onBlur } }) => (
                                                            <>
                                                                <input
                                                                    id="donorProfile"
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
                                                                    accept=".jpg,.png,.jpeg"
                                                                />
                                                                {previewUrl && (
                                                                    <div className="preview-image-container" style={{ position: 'relative', width: '200px', height: '200px' }}>
                                                                        <Image
                                                                            src={previewUrl}
                                                                            alt="Preview"
                                                                            fill 
                                                                            className="preview-image"
                                                                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    />
                                                    {errors?.donorProfile && (
                                                        <div style={{ color: "red" }} className="text-left">
                                                            {errors?.donorProfile?.message}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                    <label className="text-left">Medical History</label>
                                                    <Controller
                                                        name="medicalHistory"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <textarea
                                                                className={`input_fixed_width`}
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                            />
                                                        )}
                                                        defaultValue=""
                                                    />
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                    <label className="text-left">Mode of Contact <span style={{ color: '#F15B43' }}>*</span></label>
                                                    <div className="d-flex justify-content-start form_radio_wrapper_align_center">
                                                        <div className="form-check form-check-inline">
                                                            <Controller
                                                                name="modeofcontact"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <input
                                                                        id="email"
                                                                        style={{ border: errors?.modeofcontact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                        className={`form-check-input`}
                                                                        type="radio"
                                                                        value="email"
                                                                        checked={value === "email"}
                                                                        onChange={() => onChange("email")}
                                                                    />
                                                                )}
                                                            />
                                                            <label
                                                                className={`form-check-label mr-2`} style={{ color: errors?.modeofcontact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                                                htmlFor="email"
                                                            >
                                                                E-mail
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <Controller
                                                                name="modeofcontact"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <input
                                                                        id="contact"
                                                                        className={`form-check-input`}
                                                                        type="radio"
                                                                        style={{ border: errors?.modeofcontact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                        value="contact"
                                                                        checked={value === "contact"}
                                                                        onChange={() => onChange("contact")}
                                                                    />
                                                                )}
                                                            />
                                                            <label className={`form-check-label mr-2`} style={{ color: errors?.modeofcontact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="contact">
                                                                Phone
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <Controller
                                                                name="modeofcontact"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <input
                                                                        id="both"
                                                                        style={{ border: errors?.modeofcontact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                        className={`form-check-input`}
                                                                        type="radio"
                                                                        value="both"
                                                                        checked={value === "both"}
                                                                        onChange={() => onChange("both")}
                                                                    />
                                                                )}
                                                            />
                                                            <label className={`form-check-label mr-2`} style={{ color: errors?.modeofcontact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="both">
                                                                Both
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {errors.modeofcontact && (
                                                        <div style={{ color: "red" }} className="text-left">
                                                            {errors.modeofcontact.message}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="submit-area col-lg-12 col-12">
                                                    <Link href="/admin/blooddonor/donorlist" className="button-round button-back">
                                                        Back to List
                                                    </Link>
                                                    <button type="submit" className="button-round">
                                                        Add Donor
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddDonor