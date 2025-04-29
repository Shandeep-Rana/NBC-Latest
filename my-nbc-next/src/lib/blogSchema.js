"use client";

import * as yup from "yup";

// blog Schema
export const blogSchema = yup.object({
    title: yup.string().required("Title is required").trim(),
    content: yup.string().required("Content is required").trim(),
    publish_date: yup.string().required("Publish date of blog is required"),
    thumbnail: yup.mixed()
        .required("Thumbnail is required")
        .test("fileType", "Invalid file type", (value) => {
            if (!value) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }),
})