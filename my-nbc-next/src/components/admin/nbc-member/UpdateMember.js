"use client";

import { skilledPersonSchema } from '@/lib/FormSchemas';
import { getAllIntrests, getAllProfessions, getAllVillages } from '@/Slice/master';
import { getSkilledPerson, updateSkilledPerson } from '@/Slice/skilledPerson';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from "react-select";
import PhoneInput from 'react-phone-input-2';
import DatePicker from 'react-datepicker';
import Loader from '@/common/Loader';
import { StatesAndUnionTerritories } from '@/constants';
import Link from 'next/link';

const UpdateMember = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isDelay, setIsDelay] = useState(true);
  const { SkilledPerson, isLoading } = useSelector((state) => state.person);
  const { villages, interests, professions } = useSelector((state) => state.masterSlice);

  useEffect(() => {
    dispatch(getAllProfessions());
    dispatch(getAllVillages());
    dispatch(getAllIntrests());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSkilledPerson(id));
  }, [dispatch, id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelay(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
    resolver: yupResolver(skilledPersonSchema),
  });

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("fullName", data?.fullName);
    formData.append("mobile", data?.contact);
    formData.append("gender", data?.gender);
    formData.append("addressLine1", data?.addressLine1);
    formData.append("addressLine2", data?.addressLine2);
    formData.append("village", data?.village);
    formData.append("pincode", data?.pincode);
    formData.append("state", data?.state);
    formData.append("dob", formatDate(data?.dob));
    formData.append("interests", data?.interests);
    formData.append("profession", data?.profession);
    formData.append("contactMode", data?.preferredContact);
    dispatch(updateSkilledPerson(id, formData));
  };

  const dateFormat = 'YYYY/MM/DD';

  return (
    <>
      {isLoading || isDelay ? (
        <Loader />
      ) : (
        <div id='content'>
          <div className="row">
            <div className="col-lg-12 col-md-8">
              <div className="row my-4">
                <div className="text-center">
                  <h3>Update Skilled Person</h3>
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
                                className="input_fixed_width"
                                placeholder="Full Name"
                                type="text"
                                value={value}
                                onChange={onChange}
                                autoComplete="false"
                              />
                            )}
                            defaultValue={SkilledPerson?.name}
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
                            defaultValue={SkilledPerson?.email}
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
                          <label htmlFor="" className="text-left">Contact <span style={{ color: 'red' }}>*</span></label>
                          <Controller
                            name="contact"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <PhoneInput
                                className={`${errors?.contact ? 'valid_error' : ''}`}
                                country={"in"}
                                value={value}
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
                                defaultValue={SkilledPerson?.gender}
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
                                defaultValue={SkilledPerson?.gender}
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
                                    id="others"
                                    className={`form-check-input`}
                                    style={{ border: "1px solid #B8BDC9", borderRadius: '1px' }}
                                    type="radio"
                                    value="others"
                                    checked={value === "others"}
                                    onChange={() => onChange("others")}
                                  />
                                )}
                                defaultValue={SkilledPerson?.gender}
                              />
                              <label
                                className={`form-check-label mr-2`} style={{ fontSize: 12, marginTop: 1, fontWeight: 500 }}
                                htmlFor="others"
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
                            defaultValue={SkilledPerson?.profession}
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
                            defaultValue={SkilledPerson?.intrests}
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
                            defaultValue={SkilledPerson?.addressLine1}
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
                            defaultValue={SkilledPerson?.addressLine2 || ""}
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
                                onChange={onChange}
                                maxLength={6}
                              />
                            )}
                            defaultValue={SkilledPerson?.pincode}
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
                            defaultValue={SkilledPerson?.state}
                          />
                          {errors.state && (
                            <p style={{ color: "red", textAlign: 'left' }}>{errors.state.message}</p>
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
                            defaultValue={SkilledPerson?.village}
                          />
                          {errors.village && (
                            <p style={{ color: "red", textAlign: 'left' }}>
                              {errors.village.message}
                            </p>
                          )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                          <label className="text-left">
                            Mode of Contact <span style={{ color: "red" }}>*</span>
                          </label>
                          <div className="d-flex justify-content-start form_radio_wrapper_align_center">
                            <div className="form-check form-check-inline">
                              <Controller
                                name="preferredContact"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <input
                                    id="email"
                                    className={`form-check-input`}
                                    style={{ border: errors?.donorGender ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                                    type="radio"
                                    value="email"
                                    checked={value === "email"}
                                    onChange={() => onChange("email")}
                                  />
                                )}
                                defaultValue={SkilledPerson?.contactMode}
                              />
                              <label
                                className={`form-check-label mr-2`} style={{ color: errors?.donorGender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
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
                                    style={{ border: errors?.donorGender ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                                    value="contact"
                                    checked={value === "contact"}
                                    onChange={() => onChange("contact")}
                                  />
                                )}
                                defaultValue={SkilledPerson?.contactMode}
                              />
                              <label
                                className={`form-check-label mr-2`} style={{ color: errors?.donorGender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }}
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
                                    style={{ border: errors?.donorGender ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                                    checked={value === "both"}
                                    onChange={() => onChange("both")}
                                  />
                                )}
                                defaultValue={SkilledPerson?.contactMode}
                              />
                              <label className={`form-check-label mr-2`} style={{ color: errors?.donorGender ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="both">
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
                          <Link href="/admin/nbcmember/memberlist" className="button-round button-back">
                            Back to List
                          </Link>
                          <button type="submit" className="button-round">
                            Update Skilled Person
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

export default UpdateMember