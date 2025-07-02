"use client";

import { getAllIntrests, getAllProfessions, getAllVillages } from '@/Slice/master';
import { getuser, updateVolunteer } from '@/Slice/volunteers';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from "react-select";
import PhoneInput from 'react-phone-input-2';
import DatePicker from 'react-datepicker';
import Loader from '@/common/Loader';
import { pinCodergx, StatesAndUnionTerritories } from '@/constants';
import * as yup from "yup";
import { parseISO } from 'date-fns';

const schema = yup.object({
    fullName: yup.string().required("Name is required").trim(),
    email: yup.string().required("Email is required").trim(),
    dob: yup
        .date()
        .typeError("Invalid Date")
        .required("Date of Birth is required")
        .max(new Date(), "Date of Birth cannot be in the future")
        .test('is-at-least-18', 'Age must be at least 18 years old', function (value) {
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
            return value <= eighteenYearsAgo;
        }),
    contact: yup.string().required("Phone Number is required"),
    gender: yup.string().required("Gender is required").trim(),
    profession: yup.string().required("Current Profession is required"),
    interests: yup.string().required("Interests/Area of Expertise is required"),
    addressLine1: yup.string().required("Field is required").trim(),
    addressLine2: yup.string().nullable(),
    state: yup.string().required("State is required"),
    pincode: yup.string().required("Pin Code is required").matches(pinCodergx, "Pin Code must be 6 digits"),
    village: yup.string().required("Village/City is required"),
    availability: yup.string().nullable(),
    preferredContact: yup
        .string()
        .required("Please select the Contact Preference"),
});

const UpdateVolunteer = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.user);
    const { villages, interests, professions } = useSelector(
        (state) => state.masterSlice
    );

    useEffect(() => {
        dispatch(getuser(id));
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(getAllProfessions());
        dispatch(getAllVillages());
        dispatch(getAllIntrests());
    }, [dispatch]);

    const ProfessionsOptions = professions?.map((profession) => ({
        value: profession.professionName,
        label: profession.professionName,
    }));

    const villageOptions = villages?.map((village) => ({
        value: village.villageName,
        label: village.villageName,
    }));

    const InterestsOptions = interests?.map((interest) => ({
        value: interest.interest,
        label: interest.interest,
    }));

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD");
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("fullName", data?.fullName);
        formData.append("mobile", data?.contact);
        formData.append("dob", formatDate(data?.dob));
        formData.append("gender", data?.gender);
        formData.append("contactMode", data?.preferredContact);
        formData.append("addressLine1", data?.addressLine1);
        formData.append("addressLine2", data?.addressLine2);
        formData.append("village", data?.village);
        formData.append("pincode", data?.pincode);
        formData.append("state", data?.state);
        formData.append("interests", data?.interests);
        formData.append("profession", data?.profession);
        dispatch(updateVolunteer(id, formData));
    };
    const dateFormat = 'YYYY/MM/DD';

    return (
        <>
            {!isLoading && user !== null &&
                (
                    <>
                        <div id="content">
                            <div className="row">
                                <div className="col-lg-12 col-md-8">
                                    <div className="row my-4">
                                        <div className='text-center'>
                                            <h3>Update Volunteer</h3>
                                        </div>
                                        <div className="card-body pt-0">
                                            <div className="volunteer-contact-form">
                                                <form
                                                    onSubmit={handleSubmit(onSubmit)}
                                                    className="volunteer-form"
                                                >
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                            <label className="text-left">Name <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <Controller
                                                                name="fullName"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <input
                                                                        className="input_fixed_width"
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
                                                            <label className="text-left">Email Address <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <Controller
                                                                name="email"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <input
                                                                        className="input_fixed_width"
                                                                        type="text"
                                                                        value={value}
                                                                        onChange={onChange}
                                                                    />
                                                                )}
                                                                defaultValue={user?.email}
                                                            />
                                                            {errors?.email && (
                                                                <p style={{ color: "red", textAlign: 'left' }}>
                                                                    {errors?.email?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                            <label htmlFor="" className="text-left">
                                                                Date Of Birth <span style={{ fontSize: 12, color: '#9d9d9d' }}>(YYYY-MM-DD)</span><span style={{ color: '#F15B43' }}>  *</span>
                                                            </label>
                                                            <Controller
                                                                name="dob"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <DatePicker
                                                                        showIcon
                                                                        placeholderText="Date Of Birth"
                                                                        className={`w-100 input_fixed_width ${errors?.dob ? 'valid_error' : ''}`}
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
                                                                defaultValue={formatDate(user?.dob)}
                                                            />
                                                            {errors?.dob && (
                                                                <div style={{ color: 'red' }} className="text-left">
                                                                    {errors?.dob.message}
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
                                                                defaultValue={user?.mobile}
                                                            />
                                                            {errors?.contact && (
                                                                <div style={{ color: "red" }} className="text-left">
                                                                    {errors?.contact?.message}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                            <label className="text-left">Gender <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <div className="d-flex justify-content-start form_radio_wrapper_align_center">
                                                                <div className="form-check form-check-inline">
                                                                    <Controller
                                                                        name="gender"
                                                                        control={control}
                                                                        render={({ field: { value, onChange } }) => (
                                                                            <input
                                                                                id="male"
                                                                                className={`form-check-input`}
                                                                                style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                                type="radio"
                                                                                value="male"
                                                                                checked={value === "male"}
                                                                                onChange={() => onChange("male")}
                                                                            />
                                                                        )}
                                                                        defaultValue={user?.gender}
                                                                    />
                                                                    <label className="form-check-label mr-2" style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="male">
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
                                                                                style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                                type="radio"
                                                                                value="female"
                                                                                checked={value === "female"}
                                                                                onChange={() => onChange("female")}
                                                                            />
                                                                        )}
                                                                        defaultValue={user?.gender}
                                                                    />
                                                                    <label className="form-check-label mr-2" htmlFor="female" style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }}>
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
                                                                                style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                                type="radio"
                                                                                value="others"
                                                                                checked={value === "others"}
                                                                                onChange={() => onChange("others")}
                                                                            />
                                                                        )}
                                                                        defaultValue={user?.gender}
                                                                    />
                                                                    <label className="form-check-label mr-2" htmlFor="others" style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }}>
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
                                                            <label className="text-left">Current Profession <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <Controller
                                                                name="profession"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <ReactSelect
                                                                        placeholder="Current Profession"
                                                                        options={ProfessionsOptions}
                                                                        value={ProfessionsOptions.find(
                                                                            (option) => option.value === value
                                                                        )}
                                                                        onChange={(selected) => onChange(selected?.value)}
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
                                                                defaultValue={user?.profession}
                                                            />
                                                            {errors?.profession && (
                                                                <p style={{ color: "red", textAlign: 'left' }}>
                                                                    {errors?.profession?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                            <label className="text-left">Interests/Area of Expertise <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <Controller
                                                                name="interests"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <ReactSelect
                                                                        placeholder="Interests/Area of Expertise"
                                                                        options={InterestsOptions}
                                                                        value={InterestsOptions.find(
                                                                            (option) => option.value === value
                                                                        )}
                                                                        onChange={(selected) => onChange(selected?.value)}
                                                                        isClearable
                                                                        isSearchable
                                                                        isFocused={false}
                                                                        styles={{
                                                                            control: (provided, state) => ({
                                                                                ...provided,
                                                                                border: errors?.interests ? "1px solid red" : "1px solid #B8BDC9",
                                                                                backgroundColor: 'white',
                                                                                minHeight: 45,
                                                                                height: 45,
                                                                                boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                                                '&:hover': {
                                                                                    border: errors?.interests ? "1px solid red" : "1px solid #B8BDC9",
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
                                                        <h3>Address Details:</h3>
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                            <label className="text-left">Address Line 1 <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <Controller
                                                                name="addressLine1"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <textarea
                                                                        className="input_fixed_width"
                                                                        type="text"
                                                                        value={value}
                                                                        onChange={onChange}
                                                                    />
                                                                )}
                                                                defaultValue={user?.addressLine1}
                                                            />
                                                            {errors?.addressLine1 && (
                                                                <p style={{ color: "red", textAlign: 'left' }}>
                                                                    {errors?.addressLine1?.message}
                                                                </p>
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
                                                                        type="text"
                                                                        value={value}
                                                                        onChange={onChange}
                                                                    />
                                                                )}
                                                                defaultValue={user?.addressLine2}
                                                            />
                                                            {errors?.addressLine2 && (
                                                                <p style={{ color: "red", textAlign: 'left' }}>
                                                                    {errors?.addressLine2?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                            <label className="text-left">State <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <Controller
                                                                name="state"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <ReactSelect
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
                                                                defaultValue={user?.state}
                                                            />
                                                            {errors.state && (
                                                                <p style={{ color: "red", textAlign: 'left' }}>{errors.state.message}</p>
                                                            )}
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                            <label className="text-left">Pin Code <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <Controller
                                                                name="pincode"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <input
                                                                        className="input_fixed_width"
                                                                        type="text"
                                                                        value={value}
                                                                        maxLength={6}
                                                                        onChange={onChange}
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
                                                            <label className="text-left">Village/City <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <Controller
                                                                name="village"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <ReactSelect
                                                                        options={villageOptions}
                                                                        value={villageOptions.find(
                                                                            (option) => option.value === value
                                                                        )}
                                                                        onChange={(selected) => onChange(selected?.value)}
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
                                                                defaultValue={user?.village}
                                                            />
                                                            {errors.village && (
                                                                <p style={{ color: "red", textAlign: 'left' }}>
                                                                    {errors.village.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                            <label className="text-left">Preferred Contact <span style={{ color: '#F15B43' }}>*</span></label>
                                                            <div className="d-flex justify-content-start form_radio_wrapper_align_center">
                                                                <div className="form-check form-check-inline">
                                                                    <Controller
                                                                        name="preferredContact"
                                                                        control={control}
                                                                        render={({ field: { value, onChange } }) => (
                                                                            <input
                                                                                id="email"
                                                                                className={`form-check-input`}
                                                                                style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                                type="radio"
                                                                                value="email"
                                                                                checked={value === "email"}
                                                                                onChange={() => onChange("email")}
                                                                            />
                                                                        )}
                                                                        defaultValue={user?.contactMode}
                                                                    />
                                                                    <label
                                                                        className="form-check-label mr-2" style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                                                        htmlFor="email"
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
                                                                                type="radio"
                                                                                style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                                value="contact"
                                                                                checked={value === "contact"}
                                                                                onChange={() => onChange("contact")}
                                                                            />
                                                                        )}
                                                                        defaultValue={user?.contactMode}
                                                                    />
                                                                    <label
                                                                        className="form-check-label mr-2" style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                                                        htmlFor="contact"
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
                                                                                type="radio"
                                                                                value="both"
                                                                                style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                                checked={value === "both"}
                                                                                onChange={() => onChange("both")}
                                                                            />
                                                                        )}
                                                                        defaultValue={user?.contactMode}
                                                                    />
                                                                    <label className="form-check-label mr-2" style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="both">
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
                                                            <Link href="/admin/volunteer/volunteerlist" className="button-round button-back">
                                                                Back to List
                                                            </Link>
                                                            <button type="submit" className="button-round">
                                                                Update Volunteer
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
                    </>
                )}
        </>
    )
}

export default UpdateVolunteer