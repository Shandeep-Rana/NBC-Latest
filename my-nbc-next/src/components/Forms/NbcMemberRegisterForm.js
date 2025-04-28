"use client";

import { StatesAndUnionTerritories } from '@/constants';
import { skilledPersonSchema } from '@/lib/FormSchemas';
import { registerAsSkilledPerson } from '@/Slice/authRegister';
import { getAllProfessions, getAllVillages } from '@/Slice/master';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from "react-select";
import PhoneInput from 'react-phone-input-2';
import DatePicker from 'react-datepicker';
import { yupResolver } from '@hookform/resolvers/yup';
// import { Helmet } from 'react-helmet';
import Loader from '@/common/Loader';
import Link from 'next/link';

const NbcMemberRegisterForm = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const dateFormat = 'yyyy-MM-dd';
    const [previewUrl, setPreviewUrl] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedProfessionOption, setSelectedProfessionOption] = useState(null);
    const { isLoading } = useSelector((state) => state.userRegister);
    const { villages, professions } = useSelector((state) => state.masterSlice);

    const params = new URLSearchParams(window.location.search);
    const id = params.get('event');

    useEffect(() => {
        dispatch(getAllProfessions());
        dispatch(getAllVillages());
    }, [dispatch]);

    const ProfessionsOptions = professions.map((profession) => ({
        value: profession.professionName,
        label: profession.professionName,
    }));
    ProfessionsOptions.push({ value: "other", label: "Other" });

    const villageOptions = villages.map((village) => ({
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
        resolver: yupResolver(skilledPersonSchema),
        defaultValues: {
            agreeToTerms: false,
        },
    });

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

    const formatDate = (date) => moment(date).format("YYYY-MM-DD")

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("fullName", data?.skilledPersonFullName);
        formData.append("email", data?.skilledPersonEmail.toLowerCase());
        formData.append("password", data?.password);
        formData.append("mobile", data?.skilledPersonContact);
        formData.append("dob", formatDate(data?.skilledPersonDOB));
        formData.append("gender", data?.skilledPersonGender);
        formData.append("contactMode", data?.preferredContact);
        formData.append("village", data?.village);
        formData.append("addressLine1", data?.addressLine1);
        formData.append("addressLine2", data?.addressLine1);
        formData.append("pincode", data?.pincode);
        formData.append("state", data?.state);
        formData.append("profession", data?.currentProfession);
        formData.append("userProfile", data?.userProfile);
        formData.append("id", id);
        dispatch(registerAsSkilledPerson(formData,
            navigate, reset,
            setPreviewUrl));
    };

    return (<>
        {isLoading ? (
            <Loader />
        ) : (
            <main id="content" className="site-main">
                {/* <Helmet>
                    <title>Nangal By Cycle Skills Database | Share Your Expertise</title>
                    <meta name="description" content="Register your skills with Nangal By Cycle. Contribute your expertise to our cycling community and sustainable tourism initiatives in Nangal." />
                </Helmet> */}
                <section className="inner-banner-wrap pb-0">
                    <div
                        className="inner-baner-container"
                        // style={{ backgroundImage: `url(${innerBannerImg1})` }}
                    >
                        <div className="container">
                            <div className="inner-banner-content">
                                <h1 className="inner-title">Register as an NBC Member</h1>
                                <h4 style={{ color: 'rgb(115 115 115)' }}>This platform meant to enables all our local community, discover and book courses, classes, activities and workshops in their Area. We list the course and classes that are handpicked by our professionals.
                                </h4>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="volunteer-wrap" 
                // style={{ backgroundImage: `url(${registerimg})` }}
                >
                    <div className="container">
                        <div className="row pt-5">
                            <div className="col-lg-8 offset-lg-2">
                                <div className="volunteer-contact-form form_padding_rm">
                                    <div className="form_header_img position-relative">
                                        {/* <img src={skill_register_img} alt="" /> */}
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmit)}
                                        className="volunteer-form mt-5"
                                    >
                                        <div className="row ms-0 me-0 mx_volunteer_form">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Full Name <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="skilledPersonFullName"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            className={`input_fixed_width ${errors?.skilledPersonFullName ? 'valid_error' : ''}`}
                                                            placeholder="Full Name"
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.skilledPersonFullName && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {" "}
                                                        {errors?.skilledPersonFullName?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Date Of Birth <span style={{ fontSize: 12, color: '#9d9d9d' }}>(YYYY-MM-DD)</span><span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="skilledPersonDOB"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <DatePicker
                                                            showIcon
                                                            placeholderText="Date Of Birth"
                                                            className={`w-100 input_fixed_width ${errors?.skilledPersonDOB ? 'valid_error' : ''}`}
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
                                                {errors?.skilledPersonDOB && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.skilledPersonDOB.message}
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
                                                            className={`input_fixed_width ${errors?.password ? 'valid_error' : ''}`}
                                                            type="password"
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder="Password"
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
                                                            className={`input_fixed_width ${errors?.cpassword ? 'valid_error' : ''}`}
                                                            type="password"
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder="Confirm Password"
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.cpassword && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.cpassword?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">
                                                    Gender <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <div className="d-flex justify-content-start form_radio_wrapper_align_center">
                                                    <div className="form-check form-check-inline">
                                                        <Controller
                                                            name="skilledPersonGender"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    style={{ border: errors?.skilledPersonGender ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                    id="male"
                                                                    className={`form-check-input`}
                                                                    type="radio"
                                                                    value="male"
                                                                    checked={value === "male"}
                                                                    onChange={() => onChange("male")}
                                                                />
                                                            )}
                                                        />
                                                        <label className="form-check-label mr-2" style={{ color: errors?.skilledPersonGender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="male">
                                                            Male
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <Controller
                                                            name="skilledPersonGender"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    style={{ border: errors?.skilledPersonGender ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                    id="female"
                                                                    className={`form-check-input`}
                                                                    type="radio"
                                                                    value="female"
                                                                    checked={value === "female"}
                                                                    onChange={() => onChange("female")}
                                                                />
                                                            )}
                                                        />
                                                        <label className="form-check-label mr-2" htmlFor="female" style={{ color: errors?.skilledPersonGender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                                                            Female
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <Controller
                                                            name="skilledPersonGender"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    style={{ border: errors?.skilledPersonGender ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                    id="others"
                                                                    className={`form-check-input`}
                                                                    type="radio"
                                                                    value="others"
                                                                    checked={value === "others"}
                                                                    onChange={() => onChange("others")}
                                                                />
                                                            )}
                                                        />
                                                        <label className="form-check-label mr-2" htmlFor="others" style={{ color: errors?.skilledPersonGender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                                                            Others
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors?.skilledPersonGender && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.skilledPersonGender.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Current Profession <span style={{ color: '#F15B43' }}>*</span></label>
                                                {selectedProfessionOption === "other" ? (
                                                    <Controller
                                                        name="currentProfession"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <input
                                                                className="input_fixed_width"
                                                                type="text"
                                                                value={value}
                                                                onChange={(e) => onChange(e.target.value)}
                                                            />
                                                        )}
                                                    />
                                                ) : (
                                                    <Controller
                                                        name="currentProfession"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <ReactSelect
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
                                                                        height: '45px',
                                                                        borderRadius: '6px',
                                                                        backgroundColor: 'white',
                                                                        border: errors?.currentProfession ? "1px solid red" : "1px solid #B8BDC9",
                                                                        boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                                        '&:hover': {
                                                                            border: errors?.currentProfession ? "1px solid red" : "1px solid #B8BDC9",
                                                                        }
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
                                                {errors?.currentProfession && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.currentProfession?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <h3>Contact/Address Details:</h3>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Email<span style={{ color: '#F15B43' }}> *</span></label>
                                                <Controller
                                                    name="skilledPersonEmail"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            className={`input_fixed_width ${errors?.skilledPersonEmail ? 'valid_error' : ''}`}
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder="Email"
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.skilledPersonEmail && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.skilledPersonEmail.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Phone Number <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="skilledPersonContact"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <PhoneInput
                                                            style={{ height: 46 }}
                                                            country={"in"}
                                                            value={value}
                                                            onChange={(phone) => onChange(phone)}
                                                            className={`input_fixed_width ${errors?.skilledPersonContact ? 'valid_error' : ''}`}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.skilledPersonContact && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {" "}
                                                        {errors?.skilledPersonContact?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">Address Line 1 <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="addressLine1"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <textarea
                                                            className={`input_fixed_width ${errors?.addressLine1 ? 'valid_error' : ''}`}
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                            style={{ overflowY: 'hidden' }}
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
                                                <label className="text-left">Address Line 2</label>
                                                <Controller
                                                    name="addressLine2"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <textarea
                                                            className="input_fixed_width"
                                                            style={{ overflowY: 'hidden' }}
                                                            type="text"
                                                            value={value}
                                                            onChange={onChange}
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.addressLine2 && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.addressLine2?.message}
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
                                                            options={StatesAndUnionTerritories}
                                                            value={StatesAndUnionTerritories.find(
                                                                (option) => option.value === value
                                                            )}
                                                            onChange={(selected) =>
                                                                onChange(selected?.value)
                                                            }
                                                            isClearable
                                                            isSearchable
                                                            isFocused={false}
                                                            styles={{
                                                                control: (provided, state) => ({
                                                                    ...provided,
                                                                    height: '45px',
                                                                    borderRadius: '6px',
                                                                    backgroundColor: 'white',
                                                                    border: errors?.state ? "1px solid red" : "1px solid #B8BDC9",
                                                                    boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                                    '&:hover': {
                                                                        border: errors?.state ? "1px solid red" : "1px solid #B8BDC9",
                                                                    }
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
                                                {errors?.state && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.state?.message}
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
                                                                className="input_fixed_width"
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
                                                                        height: '45px',
                                                                        borderRadius: '6px',
                                                                        backgroundColor: 'white',
                                                                        border: errors?.village ? "1px solid red" : "1px solid #B8BDC9",
                                                                        boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                                        '&:hover': {
                                                                            border: errors?.village ? "1px solid red" : "1px solid #B8BDC9",
                                                                        }
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
                                                <label className="text-left">Pincode <span style={{ color: '#F15B43' }}>*</span></label>
                                                <Controller
                                                    name="pincode"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <input
                                                            className={`input_fixed_width ${errors?.pincode ? 'valid_error' : ''}`}
                                                            type="text"
                                                            value={value}
                                                            maxLength={6}
                                                            onChange={onChange}
                                                            placeholder="Pincode"
                                                        />
                                                    )}
                                                    defaultValue=""
                                                />
                                                {errors?.pincode && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.pincode?.message}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <label className="text-left">
                                                    Preferred Contact <span style={{ color: "red" }}>*</span>
                                                </label>
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
                                                        />
                                                        <label className="form-check-label mr-2" htmlFor="email" style={{ color: errors?.preferredContact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                                                            Email
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
                                                        />
                                                        <label className="form-check-label mr-2" htmlFor="contact" style={{ color: errors?.preferredContact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
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
                                                        />
                                                        <label className="form-check-label mr-2" htmlFor="both" style={{ color: errors?.preferredContact ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                                                            Both
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors?.preferredContact && (
                                                    <div style={{ color: "red" }} className="text-left">
                                                        {errors?.preferredContact?.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                                                <div className="mb-2 profile-photo-class">Profile Photo <span style={{ color: "red" }}> *</span></div>
                                                <label htmlFor="userProfile" className="input_fixed_width" style={{ lineHeight: 3, border: errors?.userProfile ? "1px solid red" : '1px solid #B8BDC9', }}>Upload Photo</label>
                                                <Controller
                                                    name="userProfile"
                                                    control={control}
                                                    render={({
                                                        field: { value, onChange, onBlur },
                                                    }) => (
                                                        <>
                                                            <input
                                                                id="userProfile"
                                                                type="file"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (
                                                                        file &&
                                                                        file.type.startsWith("image/")
                                                                    ) {
                                                                        const previewUrl =
                                                                            URL.createObjectURL(file);
                                                                        setPreviewUrl(previewUrl);
                                                                        onChange(file);
                                                                    }
                                                                }}
                                                                onBlur={onBlur}
                                                                accept=".png,.jpg,.jpeg"
                                                            />
                                                            {previewUrl && (
                                                                <div className="preview-image-container">
                                                                    <img
                                                                        className="preview-image"
                                                                        src={previewUrl}
                                                                        alt="Preview"
                                                                    />
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                />
                                                {errors?.userProfile && (
                                                    <p style={{ color: "red" }}>
                                                        {errors?.userProfile?.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div style={{ textAlign: 'left' }} className="mb-4">
                                                <Controller
                                                    name="agreeToTerms"
                                                    control={control}
                                                    render={({ field: { onChange, value, } }) => (
                                                        <div className="form-check ps-0 mb-0" style={{ display: 'flex', alignItems: 'baseline' }}>
                                                            <input
                                                                type="checkbox"
                                                                id="agreeToTerms"
                                                                onChange={(e) => onChange(e.target.checked)}
                                                                checked={value}
                                                                className="me-2"
                                                            />
                                                            <label className="form-check-label" htmlFor="agreeToTerms">
                                                                I agree with <Link href="/term-conditions" target="_blank">terms and conditions</Link>
                                                            </label>
                                                        </div>
                                                    )}
                                                />
                                                {errors.agreeToTerms && (
                                                    <p style={{ color: 'red' }} className="m-0">
                                                        {errors.agreeToTerms.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="submit-area col-lg-12 col-12 pb-5">
                                                <button style={{ borderRadius: 6 }} type="submit" className="button-round">
                                                    Register
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
    )
}

export default NbcMemberRegisterForm