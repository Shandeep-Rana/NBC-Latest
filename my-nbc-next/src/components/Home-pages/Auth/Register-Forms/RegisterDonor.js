"use client"

import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from 'react-datepicker';
import moment from "moment";
import { parseISO, format } from 'date-fns';
import { useRouter } from "next/navigation";
import Loader from "@/common/Loader";
import { registerAsDonor } from "@/Slice/authRegister";
import { BloodGroupOptions, StatesAndUnionTerritories } from "@/constants";
import Link from "next/link";
import { donorSchema } from "@/lib/FormSchemas";
import { getAllVillages } from "@/Slice/master";
import UpgradeDonorToVolunteer from "./UpgradeDonorToVolunteer";

function RegisterDonor() {
  const router = useRouter();
  const dispatch = useDispatch();
  const dateFormat = 'yyyy-MM-dd';
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const { isLoading } = useSelector((state) => state.userRegister);
  const { villages } = useSelector((state) => state.masterSlice);

  // State to manage the modal's visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to toggle the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    dispatch(getAllVillages());
  }, [dispatch]);

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
    defaultValues: {
      agreeToTerms: false,
    },
  });

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
    formData.append("fullName", data?.donorFullName);
    formData.append("email", data?.donorEmail.toLowerCase());
    formData.append("mobile", data?.donorContact);
    formData.append("dob", formatDate(data?.donorDOB));
    formData.append("bloodType", data?.bloodType);
    formData.append("medicalHistory", data?.medicalHistory);
    formData.append("gender", data?.donorGender);
    formData.append("contactMode", data?.preferredContact);
    formData.append("village", data?.village);
    formData.append("addressLine1", data?.addressLine1);
    formData.append("addressLine2", data?.addressLine2);
    formData.append("pincode", data?.pincode);
    formData.append("state", data?.state);
    formData.append("userProfile", data?.donorProfile);
    dispatch(registerAsDonor(formData, navigate, reset, setPreviewUrl));
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
          <div className="row ms-0 me-0 mx_volunteer_form">
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">Name<span style={{ color: "red" }}> *</span></label>
              <Controller
                name="donorFullName"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    className={`input_fixed_width ${errors?.donorFullName ? 'valid_error' : ''}`}
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
              {errors?.donorFullName && (
                <div style={{ color: "red" }} className="text-left">
                  {errors?.donorFullName?.message}
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
                    style={{ width: 340 }}
                    name="donorGender"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        style={{ border: errors?.donorGender ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                        id="male"
                        className={`form-check-input`}
                        type="radio"
                        value="male"
                        checked={value === "male"}
                        onChange={() => onChange("male")}
                      />
                    )}
                  />
                  <label className={`form-check-label mr-2`} style={{ color: errors?.donorGender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <Controller
                    name="donorGender"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        style={{ border: errors?.donorGender ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                        id="female"
                        className={`form-check-input`}
                        type="radio"
                        value="female"
                        checked={value === "female"}
                        onChange={() => onChange("female")}
                      />
                    )}
                  />
                  <label className="form-check-label mr-2" htmlFor="female" style={{ color: errors?.donorGender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                    Female
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <Controller
                    name="donorGender"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        style={{ border: errors?.donorGender ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                        id="others"
                        className={`form-check-input`}
                        type="radio"
                        value="others"
                        checked={value === "others"}
                        onChange={() => onChange("others")}
                      />
                    )}
                  />
                  <label className="form-check-label mr-2" htmlFor="others" style={{ color: errors?.donorGender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}>
                    Others
                  </label>
                </div>
              </div>
              {errors?.donorGender && (
                <div style={{ color: "red" }} className="text-left">{errors?.donorGender.message}</div>
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group mt-2">
              <label className="text-left">Medical History</label>
              <Controller
                name="medicalHistory"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <textarea
                    type="text"
                    value={value}
                    className={`input_fixed_width line_height_textarea ${errors?.medicalHistory ? 'valid_error' : ''}`}
                    onChange={onChange}
                  />
                )}
                defaultValue=""
              />
              {errors?.medicalHistory && (
                <div style={{ color: "red" }} className="text-left">
                  {errors?.medicalHistory?.message}
                </div>
              )}
            </div>
            <h3 className="mb-4">Contact/Address Details:</h3>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">Email <span style={{ color: '#F15B43' }}>*</span></label>
              <Controller
                name="donorEmail"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    placeholder="Email Address"
                    type="text"
                    value={value}
                    onChange={onChange}
                    className={`input_fixed_width ${errors?.donorEmail ? 'valid_error' : ''}`}
                  />
                )}
                defaultValue=""
              />
              {errors?.donorEmail && (
                <div style={{ color: "red" }} className="text-left"> {errors?.donorEmail.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">Phone Number <span style={{ color: '#F15B43' }}>*</span></label>
              <Controller
                name="donorContact"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <PhoneInput
                    className={`${errors?.donorContact ? 'valid_error' : ''}`}
                    country={"in"}
                    value={value}
                    onChange={(phone) => onChange(phone)}
                    style={{ border: errors?.donorContact ? '1px solid red' : "" }}
                  />
                )}
                defaultValue=""
              />
              {errors?.donorContact && (
                <div style={{ color: "red" }} className="text-left"> {errors?.donorContact?.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">Address Line 1 <span style={{ color: '#F15B43' }}>*</span></label>
              <Controller
                name="addressLine1"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <textarea
                    type="text"
                    className={`input_fixed_width line_height_textarea ${errors?.addressLine1 ? 'valid_error' : ''}`}
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
              <label htmlFor="" className="text-left">Address Line 2 </label>
              <Controller
                name="addressLine2"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <textarea
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
              <label className="text-left">State<span style={{ color: '#F15B43' }}>*</span></label>
              <Controller
                name="state"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ReactSelect
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
              {errors?.state && (
                <div style={{ color: "red" }} className="text-left">{errors?.state?.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
              <label className="text-left">City/Village <span style={{ color: '#F15B43' }}>*</span></label>
              {selectedOption === "other" ? (
                <Controller
                  name="village"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <input
                      className="input_fixed_width"
                      type="text"
                      placeholder="State"
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
                      placeholder="Select Village/City"
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
                <div style={{ color: "red" }} className="text-left">{errors?.village?.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group mt-2">
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
              {errors?.pincode && (
                <div style={{ color: "red" }} className="text-left">{errors?.pincode?.message}</div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group mt-2">
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
                        id="contact"
                        style={{ border: errors?.preferredContact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
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
                        id="both"
                        style={{ border: errors?.preferredContact ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
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
              <label htmlFor="donorProfile" className="input_fixed_width" style={{ lineHeight: 3, border: errors?.donorProfile ? "1px solid red" : '1px solid #B8BDC9', }}>Upload Photo</label>
              <Controller
                name="donorProfile"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <input
                      id="donorProfile"
                      type="file"
                      className="input_fixed_width"
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
              {errors?.donorProfile && (
                <div style={{ color: "red" }} className="text-left">{errors?.donorProfile?.message}</div>
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
              <button style={{ borderRadius: 6 }} type="submit" className="button-round">
                Register
              </button>
            </div>
            <p className="py-4">
              Already a Blood Donor. Want to become Volunteer/Member? 
              <Link href="#" style={{ color: '#F15B43' }} onClick={toggleModal}>Click here</Link>
            </p>
          </div>
        </form>
      )}
      <UpgradeDonorToVolunteer isOpen={isModalOpen} toggleModal={toggleModal} />
    </>
  );
}
export default RegisterDonor;