"use client";

import { emailrgx, pinCodergx } from "@/constants";
import * as yup from "yup";

// Donor Schema
export const donorSchema = yup.object({
  donorFullName: yup.string().required("Name is required").trim(),
  donorGender: yup.string().required("Please select the gender").trim(),
  donorDOB: yup
    .date()
    .typeError("Invalid Date")
    .required("Date of birth is required")
    .max(new Date(), "Date of Birth cannot be in the future")
    .test("is-at-least-18", "Age must be at least 18 years old", function (value) {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      return value <= eighteenYearsAgo;
    }),
  bloodType: yup.string().required("Blood Type is required"),
  medicalHistory: yup.string(),
  donorEmail: yup
    .string()
    .required("Email is required")
    .matches(emailrgx, "Invalid Email")
    .trim(),
  donorContact: yup
    .string()
    .required("Phone Number is required")
    .max(12)
    .min(10),
  addressLine1: yup.string().required("Field is required").trim(),
  addressLine2: yup.string(),
  village: yup.string().required("Village/City is required"),
  pincode: yup
    .string()
    .required("Pin Code is required")
    .matches(pinCodergx, "Pin Code must be 6 digits"),
  donorProfile: yup
    .mixed()
    .required("Profile photo is required")
    .test("fileType", "Invalid file type", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
  state: yup.string().required("State is required"),
  preferredContact: yup.string().required("Please select the Contact Preference"),
  agreeToTerms: yup.boolean().required("Required").oneOf([true], "You must accept the terms and conditions"),
});

// Volunteer Schema
export const volunteerSchema = yup.object({
  volunteerFullName: yup.string().required("Name is required").trim(),
  volunteerDOB: yup
    .date()
    .typeError("Invalid Date")
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future")
    .test("is-at-least-18", "Age must be at least 18 years old", function (value) {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      return value <= eighteenYearsAgo;
    }),
  volnteerGender: yup.string().required("Gender is required").trim(),
  currentProfession: yup.string().required("Current Profession is required"),
  password: yup.string().required("Password is required").trim(),
  cpassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  volunteerEmail: yup
    .string()
    .required("Email is required")
    .matches(emailrgx, "Invalid Email")
    .trim(),
  volunteerContact: yup
    .string()
    .required("Phone Number is required")
    .max(12)
    .min(10),
  addressLine1: yup.string().required("Field is required").trim(),
  addressLine2: yup.string().trim(),
  village: yup.string().required("Village/City is required"),
  pincode: yup
    .string()
    .required("Pin Code is required")
    .matches(pinCodergx, "Pin Code must be 6 digits number"),
  state: yup.string().required("State is required"),
  preferredContact: yup.string().required("Please select the Contact Preference"),
  userProfile: yup
    .mixed()
    .required("Profile photo is required")
    .test("fileType", "Invalid file type", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
  agreeToTerms: yup.boolean().required("Required").oneOf([true], "You must accept the terms and conditions"),
});

// Skilled Person Schema
export const skilledPersonSchema = yup.object({
  skilledPersonFullName: yup.string().required("Name is required").trim(),
  skilledPersonDOB: yup
    .date()
    .typeError("Invalid Date")
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future")
    .test("is-at-least-18", "Age must be at least 18 years old", function (value) {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      return value <= eighteenYearsAgo;
    }),
  skilledPersonGender: yup.string().required("Gender is required").trim(),
  currentProfession: yup.string().required("Current Profession is required"),
  password: yup.string().required("Password is required").trim(),
  cpassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  skilledPersonEmail: yup
    .string()
    .required("Email is required")
    .matches(emailrgx, "Invalid Email")
    .trim(),
  skilledPersonContact: yup
    .string()
    .required("Phone Number is required")
    .max(12)
    .min(10),
  addressLine1: yup.string().required("Field is required").trim(),
  addressLine2: yup.string().trim(),
  village: yup.string().required("Village/City is required"),
  pincode: yup
    .string()
    .required("Pin Code is required")
    .matches(pinCodergx, "Pin Code must be 6 digits"),
  state: yup.string().required("State is required"),
  preferredContact: yup.string().required("Please select the Contact Preference"),
  userProfile: yup
    .mixed()
    .required("Profile photo is required")
    .test("fileType", "Invalid file type", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
  agreeToTerms: yup.boolean().required("Required").oneOf([true], "You must accept the terms and conditions"),
});

export const updateUserSchema = yup.object({
  fullName: yup.string().required("Name is required").trim().min(3, "Name must be at least 3 characters"),
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
  interests: yup.string().trim(),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailrgx, "Invalid Email")
    .trim(),
  contact: yup.string().required("Phone Number is required").max(12).min(10),
  about: yup.string().nullable(),
  addressLine1: yup.string().required("Field is required").trim(),
  addressLine2: yup.string().nullable(),
  village: yup.string().required("Village/City is required"),
  pincode: yup.string().required("Pin Code is required").matches(/^[0-9]{6}$/, "Pin Code must be 6 digits")
  ,
  state: yup.string().required("State is required"),
  preferredContact: yup
    .string()
    .required("Please select the Contact Preference"),
  additionalComments: yup.string(),
  userProfile: yup.mixed()
    .required("User Profile is required")
    .test("fileType", "Invalid file type", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
});


