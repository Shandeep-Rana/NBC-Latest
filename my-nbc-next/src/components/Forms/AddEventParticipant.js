"use client";

import { eventparticipantSchema } from '@/lib/eventSchema';
import { addEventParticipant, getALLEvents, getEvent } from '@/Slice/events';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from "react-select";

const AddEventParticipant = () => {

    const dispatch = useDispatch();
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [requireUpload, setRequireUpload] = useState(false);

    const { eventsWithoutPagination } = useSelector(state => state.event);
    const { isLoading } = useSelector(state => state.event);

    const { event: selectedEvent } = useSelector((state) => state.event);
    console.log(selectedEvent)

    useEffect(() => {
        if (selectedEvent) {
            setRequireUpload(selectedEvent.requireUpload === 1);
        }
    }, [selectedEvent]);

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(eventparticipantSchema),
        defaultValues: {
            agreeToTerms: false,
        },
    });

    const handleEventChange = (selected) => {
        setValue("event", selected);
        if (selected) {
            dispatch(getEvent(selected.value));
        }
    };


    useEffect(() => {
        dispatch(getALLEvents());
    }, [dispatch]);

    const eventOptions = eventsWithoutPagination.map(event => ({
        value: event.eventId,
        label: event.title
    }));

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data?.name);
        formData.append("email", data?.email.toLowerCase());
        formData.append("contact", data?.contact);
        formData.append("event", data?.event?.value);
        formData.append("upload", data?.upload)
        dispatch(addEventParticipant(formData, reset));
        setPreviewUrl("")
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
                    <label className="text-left">
                        Select Event <span style={{ color: '#F15B43' }}>*</span>
                    </label>
                    <Controller
                        name="event"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <ReactSelect
                                placeholder="Select Event"
                                options={eventOptions}
                                value={eventOptions.find(option => option.value === value?.value)}
                                // onChange={(selected) => onChange(selected)}
                                onChange={handleEventChange}
                                isClearable
                                isSearchable
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        border: errors?.event ? "1px solid red" : "1px solid #B8BDC9",
                                        backgroundColor: 'white',
                                        minHeight: 45,
                                        height: 45,
                                        boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                        '&:hover': {
                                            border: errors?.event ? "1px solid red" : "1px solid #B8BDC9",
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
                    {errors?.event && (
                        <div style={{ color: "red" }} className="text-left">{errors?.event?.message}</div>
                    )}
                </div>
                {requireUpload && (
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                        <div className="mb-2 profile-photo-class">
                            Upload Picture <span style={{ color: "red" }}> *</span>
                        </div>
                        <label
                            htmlFor="upload"
                            className="input_fixed_width"
                            style={{
                                lineHeight: 3,
                                border: errors?.upload ? "1px solid red" : "1px solid #B8BDC9",
                            }}
                        >
                            Upload Photo or PDF
                        </label>
                        <Controller
                            name="upload"
                            control={control}
                            render={({ field: { onChange, onBlur } }) => (
                                <>
                                    <input
                                        id="upload"
                                        type="file"
                                        className="file-input-class"
                                        onBlur={onBlur}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                if (file.type.includes("pdf")) {
                                                    setPreviewUrl(null);
                                                } else {
                                                    setPreviewUrl(URL.createObjectURL(file));
                                                }
                                                setUploadedFile(file);
                                            } else {
                                                setPreviewUrl("");
                                                setUploadedFile(null);
                                            }
                                            onChange(file);
                                        }}
                                        accept="image/jpeg, image/jpg, image/png, application/pdf"
                                    />
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Profile Preview"
                                            className="img-thumbnail mt-2"
                                            style={{ maxWidth: "150px", height: "auto" }}
                                        />
                                    ) : uploadedFile && uploadedFile.type === "application/pdf" ? (
                                        <p className="mt-2">PDF uploaded: {uploadedFile.name}</p>
                                    ) : null}
                                </>
                            )}
                        />
                        {errors?.upload && (
                            <div style={{ color: "red" }} className="text-left">
                                {errors?.upload?.message}
                            </div>
                        )}
                    </div>
                )}
                <div className="submit-area col-lg-12 col-12">
                    <button type="submit" className="button-round">
                        Add Participant
                    </button>
                </div>
            </div>
        </form>
    )
}

export default AddEventParticipant