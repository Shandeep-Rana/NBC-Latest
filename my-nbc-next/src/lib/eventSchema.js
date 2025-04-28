"use client";

import * as yup from "yup";

// Donor Schema
export const eventSchema = yup.object({
    title: yup.string().required("Event title is required").trim(),
    organiserName: yup.string().required("Name is required").trim(),
    description: yup.string().required("Event Description is required").trim(),
    location: yup.string().required("Event Location is required").trim(),
    startDate: yup.string().required("Start date of event is required"),
    startTime: yup.string().required("Start time of event is required"),
    endDate: yup.string().required("End date of event is required")
        .test(
            "is-greater",
            "End date cannot be before start date",
            function (endDate) {
                const { startDate } = this.parent;
                return !startDate || !endDate || new Date(startDate) <= new Date(endDate);
            }
        ),
    endTime: yup.string().required("End time of event is required"),
    contact: yup.string(),
    category: yup.object().required("Mandatory*"),
    eventType: yup.string().required("Mandatory*"),
    requireUpload: yup.string().required("Mandatory*"),
    Participants: yup.string().required("Mandatory*"),
    maxParticipants: yup.string(),
    thumbnail: yup.mixed().required("Thumbnail is required")
        .test("fileType", "Invalid file type", (value) => {
            if (!value) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }),
    additionalThumbnail: yup.array().of(
        yup.mixed()
            .test("fileType", "Invalid file type", (value) => {
                if (!value) return true;
                return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
            })
    )
});