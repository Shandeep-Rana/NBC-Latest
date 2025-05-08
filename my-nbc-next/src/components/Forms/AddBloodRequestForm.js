"use client";

import { BloodGroupOptions } from '@/constants';
import { bloodRequirementSchema } from '@/lib/utils/UtilsSchemas';
import { addRequirement } from '@/Slice/bloodRequirement';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React from 'react'
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import { useDispatch } from 'react-redux';
import ReactSelect from "react-select";

const AddBloodRequestForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const dateFormat = "yyyy-MM-dd";

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(bloodRequirementSchema),
        defaultValues: {
            agreeToTerms: false,
        },
    });

    const formatDate = (date) => moment(date).format("YYYY-MM-DD")

    const onSubmit = (data) => {
        const requestData = {
            fullName: data?.name,
            email: data?.email,
            contact: data?.contact,
            requireDate: formatDate(data?.requirementDate),
            location: data?.location,
            description: data?.description,
            bloodType: data?.bloodType
        };
        dispatch(addRequirement(requestData, reset, router));
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="volunteer-form"
        >
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                    <label className="text-left">
                        Name<span style={{ color: "red" }}> *</span>
                    </label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <input
                                className={`input_fixed_width ${errors?.name ? "valid_error" : ""
                                    }`}
                                placeholder="Full Name"
                                type="text"
                                value={value}
                                onChange={onChange}
                                autoComplete="false"
                                data-bs-toggle="tooltip"
                                data-bs-placement="right"
                                title="As per Aadhar card or passport"
                            />
                        )}
                        defaultValue=""
                    />
                    {errors?.name && (
                        <div style={{ color: "red" }} className="text-left">
                            {errors?.name?.message}
                        </div>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                    <label className="text-left">
                        Email <span style={{ color: "#F15B43" }}>*</span>
                    </label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <input
                                placeholder="Email Address"
                                type="text"
                                value={value}
                                onChange={onChange}
                                className={`input_fixed_width ${errors?.email ? "valid_error" : ""
                                    }`}
                            />
                        )}
                        defaultValue=""
                    />
                    {errors?.email && (
                        <div style={{ color: "red" }} className="text-left">
                            {" "}
                            {errors?.email.message}
                        </div>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                    <label className="text-left">
                        Phone Number{" "}
                        <span style={{ color: "#F15B43" }}>*</span>
                    </label>        
                    <Controller
                        name="contact"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <PhoneInput
                                className={`${errors?.contact ? "valid_error" : ""
                                    }`}
                                country={"in"}
                                value={value}
                                onChange={(phone) => onChange(phone)}
                                style={{
                                    border: errors?.contact
                                        ? "1px solid red"
                                        : "",
                                }}
                            />
                        )}
                        defaultValue=""
                    />
                    {errors?.contact && (
                        <div style={{ color: "red" }} className="text-left">
                            {" "}
                            {errors?.contact?.message}
                        </div>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                    <label className="text-left">Blood Group Type <span style={{ color: '#F15B43' }}>*</span></label>
                    <Controller
                        name="bloodType"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <ReactSelect
                                placeholder="Blood Group"
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
                        <div style={{ color: "red" }} className="text-left">{errors?.bloodType?.message}</div>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                    <label htmlFor="" className="text-left">
                        Required on{" "}
                        <span style={{ fontSize: 12, color: "#9d9d9d" }}>
                            (YYYY-MM-DD)
                        </span>
                        <span style={{ color: "#F15B43" }}> *</span>
                    </label>
                    <Controller
                        name="requirementDate"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <DatePicker
                                showIcon
                                placeholderText="Required On"
                                className={`w-100 input_fixed_width ${errors?.dob ? "valid_error" : ""
                                    }`}
                                selected={value ? parseISO(value) : null}
                                style={{
                                    height: 45,
                                    border: "1px solid #B8BDC9",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    lineHeight: "4px",
                                }}
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
                                openToDate={new Date()}
                                minDate={new Date()}
                            />
                        )}
                        defaultValue=""
                    />
                    {errors?.requirementDate && (
                        <div style={{ color: "red" }} className="text-left">
                            {errors?.requirementDate.message}
                        </div>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                    <label className="text-left">
                        Location<span style={{ color: "red" }}> *</span>
                    </label>
                    <Controller
                        name="location"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <input
                                className={`input_fixed_width ${errors?.name ? "valid_error" : ""
                                    }`}
                                placeholder="Location"
                                type="text"
                                value={value}
                                onChange={onChange}
                                autoComplete="false"
                            />
                        )}
                        defaultValue=""
                    />
                    {errors?.location && (
                        <div style={{ color: "red" }} className="text-left">
                            {errors?.location?.message}
                        </div>
                    )}
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group mt-2">
                    <label className="text-left">Any Description</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <textarea
                                type="text"
                                value={value}
                                className={`input_fixed_width line_height_textarea ${errors?.addressLine1 ? 'valid_error' : ''}`}
                                onChange={onChange}
                            />
                        )}
                        defaultValue=""
                    />
                    {errors?.description && (
                        <div style={{ color: "red" }} className="text-left">
                            {errors?.description?.message}
                        </div>
                    )}
                </div>
                <div className="submit-area col-lg-12 col-12">
                    <button
                        style={{ borderRadius: 6 }}
                        className="button-round"
                        type="submit"
                    >
                        Add Requirement
                    </button>
                </div>
            </div>
        </form>
    )
}

export default AddBloodRequestForm