"use client";

import { emailrgx } from "@/constants";
import * as yup from "yup";

// bloodRequirement Schema
export const bloodRequirementSchema = yup.object({
    name: yup.string().required("Name is required").trim(),
    email: yup
        .string()
        .required("Email is required")
        .matches(emailrgx, "Invalid Email")
        .trim(),
    requirementDate: yup
        .date()
        .typeError("Mandatory*")
    ,
    bloodType: yup.string().required("Blood Type is required"),
    description: yup.string().trim(),
    location: yup.string().required("Field is required").trim(),
    contact: yup.string().required("Phone Number is required").max(12).min(10),
});

// contactrequest Schema
export const contactrequestSchema = yup.object({
    name: yup.string().required("Name is required").trim(),
    email: yup
        .string()
        .required("Email is required")
        .matches(emailrgx, "Invalid Email")
        .trim(),
    requirementDate: yup
        .date()
        .typeError("Mandatory*")
    ,
    bloodType: yup.string().required("Blood Type is required"),
    description: yup.string().trim(),
    location: yup.string().required("Field is required").trim(),
    contact: yup.string().required("Phone Number is required").max(12).min(10),
});

// faq Schema
export const faqSchema = yup.object({
    question: yup.string().required("Event title is required").trim(),
    answer: yup.string().required("Name is required").trim(),
});

// changepassword Schema
export const changepasswordSchema = yup.object({
    question: yup.string().required("Event title is required").trim(),
    answer: yup.string().required("Name is required").trim(),
});

// userprofile Schema
export const userprofileSchema = yup.object({
    fullName: yup.string().required("Name is required").trim(),
    email: yup.string().required("Email is required").trim(),
});

export const contactSchema = yup.object({
    name: yup.string().required("Name is required").trim(),
    email: yup.string().required("Email is required").trim(),
    subject: yup.string().required("Subject is required").trim(),
    phone: yup
      .number()
      .typeError("contact must be a number")
      .required("Phone Number is required"),
    description: yup.string().required("Description is required").trim(),
  })
  .required();