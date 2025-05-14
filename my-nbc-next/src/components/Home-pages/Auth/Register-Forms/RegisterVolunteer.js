"use client"

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import moment from "moment/moment";
import { parseISO, format } from "date-fns";
import DatePicker from "react-datepicker";
import Loader from "@/common/Loader";
import { registerAsVolunteer } from "@/Slice/authRegister";
import { getAllProfessions, getAllVillages } from "@/Slice/master";
import { StatesAndUnionTerritories } from "@/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { volunteerSchema } from "@/lib/FormSchemas";

const RegisterVolunteer = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const dateFormat = "yyyy-MM-dd";
    const [previewUrl, setPreviewUrl] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedProfessionOption, setSelectedProfessionOption] =
        useState(null);
    const { villages, professions } = useSelector((state) => state.masterSlice);
    const { isLoading } = useSelector((state) => state.userRegister);

    useEffect(() => {
        dispatch(getAllProfessions());
        dispatch(getAllVillages());
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
        defaultValues: {
            agreeToTerms: false,
        },
    });

    const formatDate = (date) => moment(date).format("YYYY-MM-DD");

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("fullName", data.volunteerFullName);
        formData.append("email", data.volunteerEmail.toLowerCase());
        formData.append("password", data.password);
        formData.append("mobile", data?.volunteerContact);
        formData.append("dob", formatDate(data?.volunteerDOB));
        formData.append("gender", data?.volnteerGender);
        formData.append("contactMode", data?.preferredContact);
        formData.append("village", data?.village);
        formData.append("addressLine1", data?.addressLine1);
        formData.append("addressLine2", data?.addressLine2);
        formData.append("pincode", data?.pincode);
        formData.append("state", data?.state);
        formData.append("profession", data?.currentProfession);
        formData.append("userProfile", data?.userProfile);
        dispatch(registerAsVolunteer(formData, router, reset, setPreviewUrl));
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                    <div className="row ms-0 me-0 mx_volunteer_form">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                            <label className="text-left">
                                Name <span style={{ color: "#F15B43" }}>*</span>
                            </label>
                            <Controller
                                name="volunteerFullName"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <input
                                        placeholder="Full Name"
                                        type="text"
                                        className={`input_fixed_width ${errors?.volunteerFullName ? "valid_error" : ""
                                            }`}
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                                defaultValue=""
                            />
                            {errors?.volunteerFullName && (
                                <div style={{ color: "red" }} className="text-left">
                                    {errors?.volunteerFullName?.message}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                            <label htmlFor="" className="text-left">
                                Date Of Birth{" "}
                                <span style={{ fontSize: 12, color: "#9d9d9d" }}>
                                    (YYYY-MM-DD)
                                </span>
                                <span style={{ color: "#F15B43" }}> *</span>
                            </label>
                            <Controller
                                name="volunteerDOB"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <DatePicker
                                        showIcon
                                        placeholderText="Date Of Birth"
                                        className={`w-100 input_fixed_width ${errors?.volunteerDOB ? "valid_error" : ""
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
                                        openToDate={
                                            value ? parseISO(value) : new Date("2000-01-01")
                                        }
                                    />
                                )}
                                defaultValue=""
                            />
                            {errors?.volunteerDOB && (
                                <div style={{ color: "red" }} className="text-left">
                                    {errors?.volunteerDOB.message}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                            <label htmlFor="" className="text-left">
                                Password <span style={{ color: "#F15B43" }}>*</span>
                            </label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <input
                                        placeholder="Password"
                                        className={`input_fixed_width ${errors?.password ? "valid_error" : ""
                                            }`}
                                        type="password"
                                        style={{
                                            height: 45,
                                            border: "1px solid #B8BDC9",
                                            borderRadius: "6px",
                                            overflow: "hidden",
                                            lineHeight: "4px",
                                        }}
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                                defaultValue=""
                            />
                            {errors?.password && (
                                <p style={{ color: "red" }} className="text-left">
                                    {" "}
                                    {errors?.password?.message}
                                </p>
                            )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                            <label htmlFor="" className="text-left">
                                Confirm Password<span style={{ color: "#F15B43" }}> *</span>
                            </label>
                            <Controller
                                name="cpassword"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <input
                                        placeholder="Confirm Password"
                                        className={`input_fixed_width ${errors?.cpassword ? "valid_error" : ""
                                            }`}
                                        type="password"
                                        style={{
                                            height: 45,
                                            border: "1px solid #B8BDC9",
                                            borderRadius: "6px",
                                            overflow: "hidden",
                                            lineHeight: "4px",
                                        }}
                                        value={value}
                                        onChange={onChange}
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
                            <label className="text-left">
                                Gender<span style={{ color: "red" }}> *</span>
                            </label>
                            <div className="d-flex form_radio_wrapper_align_center">
                                <div className="form-check form-check-inline">
                                    <Controller
                                        name="volnteerGender"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                style={{
                                                    border: errors?.volnteerGender
                                                        ? "1px solid red"
                                                        : "1px solid #B8BDC9",
                                                    borderRadius: "1px",
                                                }}
                                                id="male"
                                                className={`form-check-input`}
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
                                        style={{
                                            color: errors?.volnteerGender ? "red" : "",
                                            fontSize: 12,
                                            marginTop: 1,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Male
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <Controller
                                        name="volnteerGender"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                style={{
                                                    border: errors?.volnteerGender
                                                        ? "1px solid red"
                                                        : "1px solid #B8BDC9",
                                                    borderRadius: "1px",
                                                }}
                                                id="female"
                                                className={`form-check-input`}
                                                type="radio"
                                                value="female"
                                                checked={value === "female"}
                                                onChange={() => onChange("female")}
                                            />
                                        )}
                                    />
                                    <label
                                        className="form-check-label mr-2"
                                        htmlFor="female"
                                        style={{
                                            color: errors?.volnteerGender ? "red" : "",
                                            fontSize: 12,
                                            marginTop: 1,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Female
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <Controller
                                        name="volnteerGender"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                style={{
                                                    border: errors?.volnteerGender
                                                        ? "1px solid red"
                                                        : "1px solid #B8BDC9",
                                                    borderRadius: "1px",
                                                }}
                                                id="others"
                                                className={`form-check-input`}
                                                type="radio"
                                                value="others"
                                                checked={value === "others"}
                                                onChange={() => onChange("others")}
                                            />
                                        )}
                                    />
                                    <label
                                        className="form-check-label mr-2"
                                        htmlFor="others"
                                        style={{
                                            color: errors?.volnteerGender ? "red" : "",
                                            fontSize: 12,
                                            marginTop: 1,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Others
                                    </label>
                                </div>
                            </div>
                            {errors?.volnteerGender && (
                                <div style={{ color: "red" }} className="text-left">
                                    {errors?.volnteerGender.message}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                            <label htmlFor="" className="text-left">
                                Current Profession <span style={{ color: "#F15B43" }}>*</span>
                            </label>
                            {selectedProfessionOption === "other" ? (
                                <Controller
                                    name="currentProfession"
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
                                    name="currentProfession"
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
                                                    border: errors?.currentProfession
                                                        ? "1px solid red"
                                                        : "1px solid #B8BDC9",
                                                    backgroundColor: "white",
                                                    minHeight: 45,
                                                    height: 45,
                                                    boxShadow: state.isFocused
                                                        ? "0 0 0 2px transparent"
                                                        : provided.boxShadow,
                                                    "&:hover": {
                                                        border: errors?.currentProfession
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
                                    defaultValue=""
                                />
                            )}
                            {errors?.currentProfession && (
                                <div style={{ color: "red" }} className="text-left">
                                    {errors?.currentProfession?.message}
                                </div>
                            )}
                        </div>
                        <h3 className="mb-5">Contact/Address Details:</h3>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                            <label htmlFor="" className="text-left">
                                Email <span style={{ color: "#F15B43" }}>*</span>
                            </label>
                            <Controller
                                name="volunteerEmail"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <input
                                        placeholder="Email Address"
                                        style={{ overflow: "hidden", lineHeight: "4px" }}
                                        className={`input_fixed_width ${errors?.volunteerEmail ? "valid_error" : ""
                                            }`}
                                        type="text"
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                                defaultValue=""
                            />
                            {errors?.volunteerEmail && (
                                <div style={{ color: "red" }} className="text-left">
                                    {errors?.volunteerEmail.message}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                            <label htmlFor="" className="text-left">
                                Phone Number <span style={{ color: "#F15B43" }}>*</span>
                            </label>
                            <Controller
                                name="volunteerContact"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <PhoneInput
                                        style={{ borderRadius: "5px" }}
                                        className={`${errors?.volunteerContact ? "valid_error" : ""
                                            }`}
                                        country={"in"}
                                        value={value}
                                        onChange={(phone) => onChange(phone)}
                                    />
                                )}
                                defaultValue=""
                            />
                            {errors?.volunteerContact && (
                                <div style={{ color: "red" }} className="text-left">
                                    {" "}
                                    {errors?.volunteerContact?.message}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                            <label htmlFor="" className="text-left">
                                Address Line 1 <span style={{ color: "#F15B43" }}>*</span>
                            </label>

                            <Controller
                                name="addressLine1"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <textarea
                                        className={`input_fixed_width line_height_textarea ${errors?.addressLine1 ? "valid_error" : ""
                                            }`}
                                        type="text"
                                        value={value}
                                        onChange={onChange}
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
                            <label htmlFor="" className="text-left">
                                Address Line 2{" "}
                            </label>
                            <Controller
                                name="addressLine2"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <textarea
                                        className={`input_fixed_width line_height_textarea ${errors?.addressLine2 ? "valid_error" : ""
                                            }`}
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
                            <label htmlFor="" className="text-left">
                                State <span style={{ color: "#F15B43" }}>*</span>
                            </label>
                            <Controller
                                name="state"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <ReactSelect
                                        className="selectcustom"
                                        placeholder="City/Village"
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
                                                border: errors?.state
                                                    ? "1px solid red"
                                                    : "1px solid #B8BDC9",
                                                backgroundColor: "white",
                                                minHeight: 45,
                                                height: 45,
                                                boxShadow: state.isFocused
                                                    ? "0 0 0 2px transparent"
                                                    : provided.boxShadow,
                                                "&:hover": {
                                                    border: errors?.state
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
                                defaultValue=""
                            />
                            {errors?.state && (
                                <div style={{ color: "red" }} className="text-left">
                                    {errors?.state?.message}
                                </div>
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
                            <label className="text-left">
                                Area Pincode <span style={{ color: "#F15B43" }}>*</span>
                            </label>
                            <Controller
                                name="pincode"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <input
                                        placeholder="Pin Code"
                                        style={{ lineHeight: "4px" }}
                                        className={`input_fixed_width ${errors?.pincode ? "valid_error" : ""
                                            }`}
                                        maxLength={6}
                                        type="text"
                                        value={value}
                                        onChange={onChange}
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
                                Preferred Contact<span style={{ color: "red" }}> *</span>
                            </label>
                            <div className="d-flex form_radio_wrapper_align_center">
                                <div className="form-check form-check-inline">
                                    <Controller
                                        name="preferredContact"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                id="email"
                                                style={{
                                                    border: errors?.preferredContact
                                                        ? "1px solid red"
                                                        : "1px solid #B8BDC9",
                                                    borderRadius: "1px",
                                                }}
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
                                        style={{
                                            color: errors?.preferredContact ? "red" : "",
                                            fontSize: 12,
                                            marginTop: 1,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Email
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <Controller
                                        name="preferredContact"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                style={{
                                                    border: errors?.preferredContact
                                                        ? "1px solid red"
                                                        : "1px solid #B8BDC9",
                                                    borderRadius: "1px",
                                                }}
                                                id="contact"
                                                className={`form-check-input`}
                                                type="radio"
                                                value="contact"
                                                checked={value === "contact"}
                                                onChange={() => onChange("contact")}
                                            />
                                        )}
                                    />
                                    <label
                                        className="form-check-label mr-2"
                                        htmlFor="contact"
                                        style={{
                                            color: errors?.preferredContact ? "red" : "",
                                            fontSize: 12,
                                            marginTop: 1,
                                            fontWeight: 500,
                                        }}
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
                                                style={{
                                                    border: errors?.preferredContact
                                                        ? "1px solid red"
                                                        : "1px solid #B8BDC9",
                                                    borderRadius: "1px",
                                                }}
                                                id="both"
                                                className={`form-check-input`}
                                                type="radio"
                                                value="both"
                                                checked={value === "both"}
                                                onChange={() => onChange("both")}
                                            />
                                        )}
                                    />
                                    <label
                                        className="form-check-label mr-2"
                                        htmlFor="both"
                                        style={{
                                            color: errors?.preferredContact ? "red" : "",
                                            fontSize: 12,
                                            marginTop: 1,
                                            fontWeight: 500,
                                        }}
                                    >
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
                            <div className="mb-2" style={{ fontWeight: 500 }}>
                                Profile Photo
                            </div>
                            <label
                                htmlFor="userProfile"
                                className="input_fixed_width"
                                style={{
                                    lineHeight: "40px",
                                    border: errors?.userProfile
                                        ? "1px solid red"
                                        : "1px solid #B8BDC9",
                                }}
                            >
                                Upload Photo
                            </label>
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
                                            accept=".png,.jpg,.jpeg"
                                        />
                                        {previewUrl && (
                                            <div
                                                className="preview-image-container"
                                                style={{ width: 310 }}
                                            >
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
                                <div style={{ color: "red" }}>
                                    {errors?.userProfile?.message}
                                </div>
                            )}
                        </div>
                        <div style={{ textAlign: "left" }} className="mb-4">
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
                                            I agree with{" "}
                                            <Link href="/TermsAndConditions" target="_blank">
                                                terms and conditions
                                            </Link>
                                        </label>
                                    </div>
                                )}
                            />
                            {errors.agreeToTerms && (
                                <p style={{ color: "red" }} className="m-0">
                                    {errors.agreeToTerms.message}
                                </p>
                            )}
                        </div>
                        <div className="submit-area col-lg-12 col-12">
                            <button type="submit" className="button-round">
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </>
    )
}

export default RegisterVolunteer