"use client";

import { BloodGroupOptions, StatesAndUnionTerritories } from '@/constants';
import { donorSchema } from '@/lib/FormSchemas';
import { getdonor, updatedonor } from '@/Slice/bloodDonation';
import { getAllVillages } from '@/Slice/master';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from "react-select";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-input-2';

const UpdateDonor = () => {
    const dispatch = useDispatch();
    const { villages } = useSelector((state) => state.masterSlice);
    const { donor, isLoading } = useSelector((state) => state.donor);
    const { id } = useParams();
    const [isDelay, setIsDelay] = useState(true);

    useEffect(() => {
        const reloadData = async () => {
            dispatch(getdonor(id));
        };
        reloadData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDelay(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const villageOptions = villages?.map((village) => ({
        value: village.villageName,
        label: village.villageName,
    }));

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(donorSchema),
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("fullName", data?.fullName);
        formData.append("mobile", data?.contact);
        formData.append("dob", formatDate(data?.dob));
        formData.append("gender", data?.gender);
        formData.append("contactMode", data?.modeofcontact);
        formData.append("village", data?.village);
        formData.append("addressLine1", data?.addressline1);
        formData.append("addressLine2", data?.addressLine2);
        formData.append("pincode", data?.pincode);
        formData.append("state", data?.stateOption);
        formData.append("bloodType", data?.bloodType);
        formData.append("medicalHistory", data?.medicalHistory);
        dispatch(updatedonor(id, formData));
    };

    useEffect(() => {
        dispatch(getAllVillages());
    }, []);

    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD");
    };
    const dateFormat = 'YYYY/MM/DD';

    return (
        <>
            {!isLoading && donor !== null && !isDelay &&
                (
                    <div id='content'>
                        <div className="row">
                            <div className="col-lg-12 col-md-8">
                                <div className="row my-4">
                                    <div className='text-center'><h3>Update Donor</h3></div>
                                    <div className="card-body pt-0">
                                        <div className="volunteer-contact-form">
                                            <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Full Name <span style={{ color: '#F15B43' }}>*</span></label>
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
                                                            defaultValue={donor?.name}
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
                                                            defaultValue={donor?.email}
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
                                                            defaultValue={donor?.bloodType}
                                                        />
                                                        {errors?.bloodType && (
                                                            <div style={{ color: "red", textAlign: 'left' }} className="text-left">
                                                                {errors?.bloodType?.message}
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
                                                                    defaultValue={donor?.gender}
                                                                />
                                                                <label
                                                                    className={`form-check-label mr-2`} style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                                                    htmlFor="male"
                                                                >
                                                                    Male
                                                                </label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <Controller
                                                                    name="gender"
                                                                    control={control}
                                                                    style={{ border: "ridge" }}
                                                                    render={({ field: { value, onChange } }) => (
                                                                        <input
                                                                            id="female"
                                                                            style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                            className={`form-check-input`}
                                                                            type="radio"
                                                                            value="female"
                                                                            checked={value === "female"}
                                                                            onChange={() => onChange("female")}
                                                                        />
                                                                    )}
                                                                    defaultValue={donor?.gender}
                                                                />
                                                                <label
                                                                    className={`form-check-label mr-2`} style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                                                    htmlFor="female"
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
                                                                            style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                            id="others"
                                                                            className={`form-check-input`}
                                                                            type="radio"
                                                                            value="others"
                                                                            checked={value === "others"}
                                                                            onChange={() => onChange("others")}
                                                                        />
                                                                    )}
                                                                    defaultValue={donor?.gender}
                                                                />
                                                                <label
                                                                    className={`form-check-label mr-2`} style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                                                    htmlFor="others"
                                                                >
                                                                    Others
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {errors?.donorGender && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors?.donorGender?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Address Line 1 <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <Controller
                                                            name="addressline1"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <textarea
                                                                    className="input_fixed_width"
                                                                    type="text"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                />
                                                            )}
                                                            defaultValue={donor?.addressLine1}
                                                        />
                                                        {errors?.addressLine1 && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors?.addressLine1?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Address Line 2 <span style={{ color: '#F15B43' }}>*</span></label>
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
                                                            defaultValue={donor?.addressLine2 !== "undefined" ? donor?.addressLine2 : ""}
                                                        />
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
                                                            defaultValue={donor?.pincode}
                                                        />
                                                        {errors.pincode && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors.pincode.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">State <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <Controller
                                                            name="stateOption"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <ReactSelect
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
                                                            defaultValue={donor?.state}
                                                        />
                                                        {errors.stateOption && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors.stateOption.message}
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
                                                                    className="selectcustom"
                                                                    options={villageOptions}
                                                                    value={villageOptions.find(option => option.value === value) || null}
                                                                    onChange={(selected) => onChange(selected ? selected.value : null)}
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
                                                            defaultValue={donor?.village || null}
                                                        />
                                                        {errors.village && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors.village.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Medical History <span style={{ color: '#F15B43' }}>*</span></label>
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
                                                            defaultValue={donor?.medicalHistory}
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Medical History</label>
                                                        <div className="d-flex justify-content-start form_radio_wrapper_align_center">
                                                            <div className="form-check form-check-inline">
                                                                <Controller
                                                                    name="modeofcontact"
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
                                                                    defaultValue={donor?.contactMode}
                                                                />
                                                                <label
                                                                    className={`form-check-label mr-2`} style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }}
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
                                                                            style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                            type="radio"
                                                                            value="contact"
                                                                            checked={value === "contact"}
                                                                            onChange={() => onChange("contact")}
                                                                        />
                                                                    )}
                                                                    defaultValue={donor?.contactMode}
                                                                />
                                                                <label className={`form-check-label mr-2`} style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="contact">
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
                                                                            className={`form-check-input`}
                                                                            style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                                                            type="radio"
                                                                            value="both"
                                                                            checked={value === "both"}
                                                                            onChange={() => onChange("both")}

                                                                        />

                                                                    )}
                                                                    defaultValue={donor?.contactMode}
                                                                />
                                                                <label className={`form-check-label mr-2`} style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="both">
                                                                    Both
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {errors.modeofcontact && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors.modeofcontact.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="submit-area col-lg-12 col-12">
                                                        <Link href="/admin/blooddonor/donorlis" className="button-round button-back">
                                                            Back to List
                                                        </Link>
                                                        <button type="submit" className="button-round">
                                                            Update Donor
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div >
                    </div>
                )}
        </>
    )
}

export default UpdateDonor