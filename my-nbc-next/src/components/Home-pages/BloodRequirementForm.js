"use client";

import React from "react";
import { useDispatch } from "react-redux";
// import innerBannerImg1 from "@/Assets/Images/Event-bg-01-01.jpg";
// import Loginbg from "@/Assets/Images/Loginbg.jpg";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";
import moment from "moment";
import { format, parseISO } from "date-fns";
import ReactSelect from "react-select";
import { bloodRequirementSchema } from "@/lib/utils/UtilsSchemas";
import { addRequirement } from "@/Slice/bloodRequirement";
import { BloodGroupOptions } from "@/constants";

const BloodRequirementForm = () => {
  const dispatch = useDispatch();
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

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");

  const onSubmit = (data) => {
    const requestData = {
      fullName: data?.name,
      email: data?.email,
      contact: data?.contact,
      requireDate: formatDate(data?.requirementDate),
      location: data?.location,
      description: data?.description,
      bloodType: data?.bloodType,
    };
    dispatch(addRequirement(requestData, reset));
  };

  return (
    <main id="content" className="site-main">
      <section className="inner-banner-wrap pb-0">
        <div
          className="inner-baner-container"
          // style={{ backgroundImage: `url(${innerBannerImg1.src})` }}
        >
          <div className="container">
            <div className="inner-banner-content">
              <h1 className="inner-title">Blood Request Portal</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="volunteer-wrap" 
      // style={{ backgroundImage: `url(${Loginbg.src})` }}
      >
        <div className="container">
          <div className="row pt-5">
            <div className="col-lg-8 offset-lg-2">
              <div className="volunteer-contact-form">
                <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                  <div className="row">

                    {/* Name */}
                    <div className="col-lg-6 form-group">
                      <label>Name<span style={{ color: "red" }}> *</span></label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`input_fixed_width ${errors?.name ? "valid_error" : ""}`}
                            placeholder="Full Name"
                          />
                        )}
                      />
                      {errors?.name && <div className="text-left text-danger">{errors.name.message}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-lg-6 form-group">
                      <label>Email <span style={{ color: "#F15B43" }}>*</span></label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`input_fixed_width ${errors?.email ? "valid_error" : ""}`}
                            placeholder="Email Address"
                          />
                        )}
                      />
                      {errors?.email && <div className="text-left text-danger">{errors.email.message}</div>}
                    </div>

                    {/* Phone */}
                    <div className="col-lg-6 form-group">
                      <label>Phone Number<span style={{ color: "#F15B43" }}>*</span></label>
                      <Controller
                        name="contact"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput
                            {...field}
                            country="in"
                            value={field.value}
                            onChange={field.onChange}
                            inputClass={errors?.contact ? "valid_error" : ""}
                          />
                        )}
                      />
                      {errors?.contact && <div className="text-left text-danger">{errors.contact.message}</div>}
                    </div>

                    {/* Blood Type */}
                    <div className="col-lg-6 form-group">
                      <label>Blood Group Type <span style={{ color: '#F15B43' }}>*</span></label>
                      <Controller
                        name="bloodType"
                        control={control}
                        render={({ field }) => (
                          <ReactSelect
                            {...field}
                            options={BloodGroupOptions}
                            value={BloodGroupOptions.find(opt => opt.value === field.value)}
                            onChange={(selected) => field.onChange(selected?.value)}
                            placeholder="Blood Group"
                            isClearable
                            styles={{
                              control: (base) => ({
                                ...base,
                                border: errors?.bloodType ? "1px solid red" : base.border,
                                minHeight: 45
                              })
                            }}
                          />
                        )}
                      />
                      {errors?.bloodType && <div className="text-left text-danger">{errors.bloodType.message}</div>}
                    </div>

                    {/* Requirement Date */}
                    <div className="col-lg-6 form-group">
                      <label>Required on <span className="text-muted">(YYYY-MM-DD)</span><span style={{ color: "#F15B43" }}> *</span></label>
                      <Controller
                        name="requirementDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value ? parseISO(field.value) : null}
                            onChange={(date) => {
                              if (date && moment(date).isValid()) {
                                field.onChange(format(date, dateFormat));
                              } else {
                                field.onChange(null);
                              }
                            }}
                            placeholderText="Required On"
                            className={`w-100 input_fixed_width ${errors?.requirementDate ? "valid_error" : ""}`}
                            dateFormat={dateFormat}
                            minDate={new Date()}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                          />
                        )}
                      />
                      {errors?.requirementDate && <div className="text-left text-danger">{errors.requirementDate.message}</div>}
                    </div>

                    {/* Location */}
                    <div className="col-lg-6 form-group">
                      <label>Location<span style={{ color: "red" }}> *</span></label>
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`input_fixed_width ${errors?.location ? "valid_error" : ""}`}
                            placeholder="Location"
                          />
                        )}
                      />
                      {errors?.location && <div className="text-left text-danger">{errors.location.message}</div>}
                    </div>

                    {/* Description */}
                    <div className="col-lg-12 form-group mt-2">
                      <label>Any Description</label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            className="input_fixed_width line_height_textarea"
                          />
                        )}
                      />
                    </div>

                    {/* Submit */}
                    <div className="submit-area col-lg-12">
                      <button type="submit" className="button-round" style={{ borderRadius: 6 }}>
                        Add Requirement
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
  );
};

export default BloodRequirementForm;
