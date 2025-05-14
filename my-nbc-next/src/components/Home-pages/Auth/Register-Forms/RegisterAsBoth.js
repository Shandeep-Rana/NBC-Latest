"use client"

import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as yup from "yup";
import { parseISO, format } from 'date-fns';
import moment from "moment";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from "@/common/Loader";
import { registerAsBoth } from "@/Slice/authRegister";
import Link from "next/link";
import { BloodGroupOptions, emailrgx, pinCodergx, StatesAndUnionTerritories } from "@/constants";
import { useRouter } from "next/navigation";
import { getAllProfessions, getAllVillages } from "@/Slice/master";

const schema = yup.object({
  fullName: yup.string().required("Name is required").trim(),
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
  gender: yup.string().required("Gender is required").trim(),
  profession: yup.string().required("Current Profession is required"),
  password: yup.string().required("Password is required").trim(),
  cpassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailrgx, "Invalid Email")
    .trim(),
  contact: yup.string().required("Phone Number is required").max(12).min(10),
  addressLine1: yup.string().required("Field is required").trim(),
  addressLine2: yup.string().trim(),
  village: yup.string().required("Village/City is required"),
  pincode: yup.string().required("Pin Code is required").matches(pinCodergx, "Pin Code must be 6 digits number"),
  state: yup.string().required("State is required"),
  preferredContact: yup
    .string()
    .required("Please select the Contact Preference"),
  bloodType: yup.string().required("Blood Type is required"),
  userProfile: yup
    .mixed()
    .test("fileType", "Invalid file type", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    })
    .required(),
  agreeToTerms: yup.boolean()
    .required('Required')
    .oneOf([true], 'You must accept the terms and conditions')
});

const RegisterAsBoth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const dateFormat = 'yyyy-MM-dd';
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedProfessionOption, setSelectedProfessionOption] = useState(null);
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
    resolver: yupResolver(schema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const formatDate = (date) => moment(date).format("YYYY-MM-DD")

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("fullName", data?.fullName);
    formData.append("email", data?.email.toLowerCase());
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
    formData.append("bloodType", data?.bloodType);
    formData.append("medicalHistory", data?.medicalHistory);
    formData.append("userProfile", data?.userProfile);
    dispatch(registerAsBoth(formData, router, reset, setPreviewUrl));
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
          <div className="row ms-0 me-0 mx_volunteer_form">
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label htmlFor="" className="text-left">Name <span style={{ color: '#F15B43' }}>*</span></label>
              <Controller
                name="fullName"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    placeholder="Name"
                    className={`input_fixed_width ${errors?.fullName ? 'valid_error' : ''}`}
                    type="text"
                    value={value}
                    onChange={onChange}
                    style={{ lineHeight: '4px' }}
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
              <label htmlFor="" className="text-left">Date Of Birth <span style={{ fontSize: 12, color: '#9d9d9d' }}>(YYYY-MM-DD)</span><span style={{ color: '#F15B43' }}>*</span></label>
              <Controller
                name="dob"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    icon="fa fa-calendar"
                    isClearable
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
                    dateFormat={dateFormat}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    openToDate={value ? parseISO(value) : new Date('2000-01-01')}
                  />
                )}
                defaultValue=""
              />
              {errors?.dob && (
                <div style={{ color: "red" }} className="text-left">{errors?.dob.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label htmlFor="" className="text-left">Password <span style={{ color: '#F15B43' }}>*</span></label>
              <Controller
                name="password"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    placeholder="Password"
                    className={`input_fixed_width ${errors?.password ? 'valid_error' : ''}`}
                    style={{ lineHeight: '4px' }}
                    type="password"
                    value={value}
                    onChange={onChange}

                  />
                )}
                defaultValue=""
              />
              {errors?.password && (
                <div style={{ color: "red" }} className="text-left"> {errors?.password?.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">
                Confirm Password<span style={{ color: "red" }}> *</span>
              </label>
              <Controller
                name="cpassword"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    placeholder="Confirm Password"
                    type="password"
                    style={{ lineHeight: '4px' }}
                    className={`input_fixed_width ${errors?.cpassword ? 'valid_error' : ''}`}
                    value={value}
                    onChange={onChange}
                  />
                )}
                defaultValue=""
              />
              {errors?.cpassword && (
                <div style={{ color: "red" }} className="text-left"> {errors?.cpassword?.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">
                Gender<span style={{ color: "red" }}> *</span>
              </label>
              <div className="d-flex form_radio_wrapper_align_center">
                <div className="form-check form-check-inline">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        style={{ borderRadius: '1px', border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9' }}
                        id="male"
                        className={`form-check-input`}
                        type="radio"
                        value="male"
                        checked={value === "male"}
                        onChange={() => onChange("male")}
                      />
                    )}
                  />
                  <label className="form-check-label mr-2" htmlFor="male" style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        style={{ borderRadius: '1px', border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9' }}
                        id="female"
                        className={`form-check-input`}
                        type="radio"
                        value="female"
                        checked={value === "female"}
                        onChange={() => onChange("female")}
                      />
                    )}
                  />
                  <label className="form-check-label mr-2" htmlFor="female" style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                    Female
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        style={{ borderRadius: '1px', border: errors?.gender ? "1px solid red" : '1px solid #B8BDC9' }}
                        id="others"
                        className={`form-check-input`}
                        type="radio"
                        value="others"
                        checked={value === "others"}
                        onChange={() => onChange("others")}
                      />
                    )}
                  />
                  <label className="form-check-label mr-2" htmlFor="others" style={{ color: errors?.gender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                    Others
                  </label>
                </div>
              </div>
              {errors?.gender && (
                <div style={{ color: "red" }} className="text-left">{errors?.gender.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">
                Current Profession<span style={{ color: "red" }}> *</span>
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
                      className='selectcustom'
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
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">
                Blood Group <span style={{ color: "red" }}> *</span>
              </label>
              <Controller
                name="bloodType"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ReactSelect
                    classNames='selectcustom'
                    placeholder="Blood Group"
                    options={BloodGroupOptions}
                    value={BloodGroupOptions.find(
                      (option) => option.value === value
                    )}
                    onChange={(selected) => onChange(selected?.value)}
                    isClearable
                    isSearchable
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
            <h3>Contact/Address Details:</h3>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">
                Email<span style={{ color: "red" }}> *</span>
              </label>
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
                  {errors?.email.message}
                </div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">
                Phone<span style={{ color: "red" }}> *</span>
              </label>
              <Controller
                name="contact"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <PhoneInput
                    country={"in"}
                    style={{ border: errors?.contact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '5px' }}
                    value={value}
                    onChange={(phone) => onChange(phone)}
                  />
                )}
                defaultValue=""
              />
              {errors?.contact && (
                <div style={{ color: "red", borderRadius: 4 }} className="text-left">
                  {errors?.contact?.message}
                </div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">Address Line 1<span style={{ color: "red" }}> *</span></label>
              <Controller
                name="addressLine1"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <textarea
                    placeholder="Address"
                    className={`input_fixed_width line_height_textarea ${errors?.addressLine1 ? 'valid_error' : ''}`}
                    type="text"
                    value={value}
                    onChange={onChange}
                  />
                )}
                defaultValue=""
              />
              {errors?.addressLine1 && (
                <div style={{ color: "red" }} className="text-left">{errors?.addressLine1?.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">Address Line 2</label>
              <Controller
                name="addressLine2"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <textarea
                    placeholder="Address"
                    className={`input_fixed_width line_height_textarea ${errors?.addressLine2 ? 'valid_error' : ''}`}
                    type="text"
                    value={value}
                    onChange={onChange}
                  />
                )}
                defaultValue=""
              />
              {errors?.addressLine2 && (
                <div style={{ color: "red" }} className="text-left">{errors?.addressLine2?.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">
                State<span style={{ color: "red" }}> *</span>
              </label>
              <Controller
                name="state"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ReactSelect
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
              {errors?.state && (
                <div style={{ color: "red" }} className="text-left">{errors?.state?.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">
                City/Village<span style={{ color: "red" }}> *</span>
              </label>
              {selectedOption === "other" ? (
                <Controller
                  name="village"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <input
                      type="text"
                      placeholder="City/Village"
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
                          padding: '0px 0 0 8px',
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
                <p style={{ color: "red" }} className="text-left">{errors?.village?.message}</p>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">
                Pincode<span style={{ color: "red" }}> *</span>
              </label>
              <Controller
                name="pincode"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    placeholder="Pin Code"
                    className={`input_fixed_width ${errors?.pincode ? 'valid_error' : ''}`}
                    type="text"
                    maxLength={6}
                    value={value}
                    onChange={onChange}
                  />
                )}
                defaultValue=""
              />
              {errors?.pincode && (
                <div style={{ color: "red" }} className="text-left">{errors?.pincode?.message}</div>
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
                  <label className="form-check-label mr-2" htmlFor="email" style={{ fontSize: 12, marginTop: 1, fontWeight: 500, color: errors?.preferredContact ? 'red' : '' }}>
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
                  <label className="form-check-label mr-2" htmlFor="contact" style={{ fontSize: 12, marginTop: 1, fontWeight: 500, color: errors?.preferredContact ? 'red' : '' }}>
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
                  <label className="form-check-label mr-2" htmlFor="both" style={{ fontSize: 12, marginTop: 1, fontWeight: 500, color: errors?.preferredContact ? 'red' : '' }}>
                    Both
                  </label>
                </div>
              </div>
              {errors?.preferredContact && (
                <p style={{ color: "red" }}>
                  {errors?.preferredContact?.message}
                </p>
              )}
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group mt-2">
              <label className="text-left">
                Medical History
              </label>
              <Controller
                name="medicalHistory"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <textarea
                    placeholder="Medical History"
                    type="text"
                    className="input_fixed_width line_height_textarea"
                    value={value}
                    onChange={onChange}
                  />
                )}
                defaultValue=""
              />
              {errors?.medicalHistory && (
                <p style={{ color: "red" }}>
                  {errors?.medicalHistory?.message}
                </p>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
              <div className="mb-2" style={{ fontWeight: 500 }}>Profile Photo</div>
              <label htmlFor="userProfile"
                className="input_fixed_width"
                style={{
                  lineHeight: '40px',
                  border: errors?.userProfile ? "1px solid red" : '1px solid #B8BDC9'
                }}>Upload Photo</label>
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
                      <div className="preview-image-container" style={{ width: 310 }}>
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
                <div style={{ color: "red" }}>{errors?.userProfile?.message}</div>
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
                      I agree with <Link href="/TermsAndConditions" target="_blank">terms and conditions</Link>
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
            <div className="submit-area col-lg-12 col-12">
              <button type="submit" className="button-round">
                Register
              </button>
            </div>
          </div>
        </form >
      )}
    </>
  )
}

export default RegisterAsBoth