"use client";

import Loader from '@/common/Loader';
import QuillEditor from '@/common/QuillEditor';
import { EventTypeOptions, getUserInfoFromToken, ROLES } from '@/constants';
import { eventSchema } from '@/lib/eventSchema';
import { getAllEventCategories } from '@/Slice/eventCategory';
import { addEvent } from '@/Slice/events';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import PhoneInput from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from "react-select";

const AddEventForm = () => {
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(eventSchema),
    });

    const userInfo = getUserInfoFromToken();
    const userId = userInfo ? userInfo.userId : null;
    const isAdmin = userInfo?.roleName?.includes(ROLES.Admin);
    const backPath = isAdmin ? "/admin/all-events" : "/user/events";
    const [previewUrl, setPreviewUrl] = useState("");
    const [additionalThumbnail, setAdditionalThumbnail] = useState([]);
    const [cloneAdditionalThumbnail, setCloneAdditionalThumbnail] = useState([]);
    const [allowParticipants, setAllowParticipants] = useState('false');

    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const handleAdditionalThumbnail = (e, onChange) => {
        const newImages = Array.from(e.target.files);
        const imgUrl = newImages.map((image) => URL.createObjectURL(image));
        setAdditionalThumbnail(prev => [...prev, ...imgUrl]);
        setCloneAdditionalThumbnail(prev => [...prev, ...newImages]);
        onChange(newImages);
    }

    const removeImageHandle = (index) => {
        const img = [...additionalThumbnail];
        const cloneImg = [...cloneAdditionalThumbnail];
        img.splice(index, 1);
        cloneImg.splice(index, 1);
        setAdditionalThumbnail(img);
        setCloneAdditionalThumbnail(cloneImg);
    }

    useEffect(() => {
        dispatch(getAllEventCategories());
    }, [dispatch]);

    const { eventCategories } = useSelector(state => state.eventCategory);

    const eventCategoryOptions = eventCategories.map(eventCategory => ({
        value: eventCategory.categoryId,
        label: eventCategory.categoryName
    }));

    const onSubmit = (data) => {
        const startDateTime = `${data?.startDate} ${data?.startTime}`;
        const endDateTime = `${data?.endDate} ${data?.endTime}`;
        const formData = new FormData();
        formData.append("title", data?.title);
        formData.append("organiser", data?.organiserName);
        formData.append("description", data?.description);
        formData.append("contact", data?.contact);
        formData.append("startDateTime", startDateTime);
        formData.append("endDateTime", endDateTime);
        formData.append("thumbnail", data?.thumbnail);
        formData.append("location", data?.location);
        formData.append("userId", userId);
        formData.append("eventType", data?.eventType);
        formData.append("eventCategory", data?.category?.value);
        formData.append("requireUpload", data?.requireUpload);
        formData.append("allowParticipants", data?.Participants);
        formData.append("maxParticipants", data?.maxParticipants);
        for (let i = 0; i < cloneAdditionalThumbnail.length; i++) {
            formData.append('additionalThumbnail', cloneAdditionalThumbnail[i]);
        }
        dispatch(addEvent(formData, navigate, reset));
    };

    const { isLoading } = useSelector((state) => state.event);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div id="content">
                        <div className="row">
                            <div className="col-lg-12 col-md-8">
                                <div className="row my-4">
                                    <div className="text-center">
                                        <h3>Add Event</h3>
                                    </div>
                                    <div className="card-body pt-0">
                                        <div className="volunteer-contact-form">
                                            <form onSubmit={handleSubmit(onSubmit)} className="volunteer-form">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Organiser Name <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <Controller
                                                            name="organiserName"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    type="text"
                                                                    className={`input_fixed_width`}
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    autoComplete="false"
                                                                />
                                                            )}
                                                            defaultValue=""
                                                        />
                                                        {errors?.organiserName && (
                                                            <div style={{ color: "red", textAlign: 'left' }} className="text-left">
                                                                {errors?.organiserName?.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-6 form-group">
                                                        <label className="text-left">Event Title <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <Controller
                                                            name="title"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    className={`input_fixed_width`}
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
                                                        {errors?.title && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors?.title?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">
                                                            Select Event Type <span style={{ color: '#F15B43' }}>*</span>
                                                        </label>
                                                        <Controller
                                                            name="eventType"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <ReactSelect
                                                                    placeholder="Select Event Type"
                                                                    options={EventTypeOptions}
                                                                    value={EventTypeOptions.find(
                                                                        (option) => option.value === value
                                                                    )}
                                                                    onChange={(selected) => onChange(selected?.value)}
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
                                                        {errors?.eventType && (
                                                            <div style={{ color: "red" }} className="text-left">{errors?.eventType?.message}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">
                                                            Select Event Category <span style={{ color: '#F15B43' }}>*</span>
                                                        </label>
                                                        <Controller
                                                            name="category"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <ReactSelect
                                                                    placeholder="Select Event Type"
                                                                    options={eventCategoryOptions}
                                                                    value={eventCategoryOptions.find(option => option.value === value?.value)}
                                                                    onChange={(selected) => onChange(selected)}
                                                                    isClearable
                                                                    isSearchable
                                                                    styles={{
                                                                        control: (provided, state) => ({
                                                                            ...provided,
                                                                            border: errors?.category ? "1px solid red" : "1px solid #B8BDC9",
                                                                            backgroundColor: 'white',
                                                                            minHeight: 45,
                                                                            height: 45,
                                                                            boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                                                                            '&:hover': {
                                                                                border: errors?.category ? "1px solid red" : "1px solid #B8BDC9",
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
                                                        {errors?.category && (
                                                            <div style={{ color: "red" }} className="text-left">{errors?.category?.message}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="mb-2 text-left">
                                                            Participants allowed <span style={{ color: '#F15B43' }}>*</span>
                                                        </label>
                                                        <div className="d-flex justify-content-start form_radio_wrapper_align_center">
                                                            <div className="form-check form-check-inline">
                                                                <Controller
                                                                    name="Participants"
                                                                    control={control}
                                                                    render={({ field: { value, onChange } }) => (
                                                                        <input
                                                                            id="yes"
                                                                            style={{
                                                                                border: errors?.Participants ? '1px solid red' : '1px solid #B8BDC9',
                                                                                borderRadius: '1px',
                                                                            }}
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            value="true"
                                                                            checked={value === 'true'}
                                                                            onChange={(e) => {
                                                                                onChange(e.target.value);
                                                                                setAllowParticipants(e.target.value);
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                                <label
                                                                    className="form-check-label mr-2"
                                                                    style={{
                                                                        color: errors?.Participants ? 'red' : '',
                                                                        fontSize: 12,
                                                                        marginTop: 1,
                                                                        fontWeight: 500,
                                                                    }}
                                                                    htmlFor="yes"
                                                                >
                                                                    Yes
                                                                </label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <Controller
                                                                    name="Participants"
                                                                    control={control}
                                                                    render={({ field: { value, onChange } }) => (
                                                                        <input
                                                                            id="no"
                                                                            style={{
                                                                                border: errors?.Participants ? '1px solid red' : '1px solid #B8BDC9',
                                                                                borderRadius: '1px',
                                                                            }}
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            value="false"
                                                                            checked={value === 'false'}
                                                                            onChange={(e) => {
                                                                                onChange(e.target.value);
                                                                                setAllowParticipants(e.target.value);
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                                <label
                                                                    className="form-check-label mr-2"
                                                                    style={{
                                                                        color: errors?.Participants ? 'red' : '',
                                                                        fontSize: 12,
                                                                        marginTop: 1,
                                                                        fontWeight: 500,
                                                                    }}
                                                                    htmlFor="no"
                                                                >
                                                                    No
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {errors?.Participants && (
                                                            <div style={{ color: 'red' }} className="text-left">
                                                                {errors?.Participants?.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {allowParticipants === 'true' && (
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                            <label className="text-left">Max Participants</label>
                                                            <Controller
                                                                name="maxParticipants"
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <input
                                                                        type="text"
                                                                        className="input_fixed_width"
                                                                        value={value}
                                                                        onChange={onChange}
                                                                        autoComplete="false"
                                                                    />
                                                                )}
                                                                defaultValue=""
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="mb-2 text-left">Upload Required <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <div className="d-flex justify-content-start form_radio_wrapper_align_center">
                                                            <div className="form-check form-check-inline">
                                                                <Controller
                                                                    name="requireUpload"
                                                                    control={control}
                                                                    render={({ field: { value, onChange } }) => (
                                                                        <input
                                                                            id="yes"
                                                                            style={{ border: errors?.requireUpload ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                            className={`form-check-input`}
                                                                            type="radio"
                                                                            value="true"
                                                                            checked={value === "true"}
                                                                            onChange={() => onChange("true")}
                                                                        />
                                                                    )}
                                                                />
                                                                <label className={`form-check-label mr-2`} style={{ color: errors?.requireUpload ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="male">
                                                                    Yes
                                                                </label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <Controller
                                                                    name="requireUpload"
                                                                    control={control}
                                                                    render={({ field: { value, onChange } }) => (
                                                                        <input
                                                                            id="no"
                                                                            className={`form-check-input`}
                                                                            style={{ border: errors?.requireUpload ? "1px solid red" : '1px solid #B8BDC9', borderRadius: '1px' }}
                                                                            type="radio"
                                                                            value="false"
                                                                            checked={value === "false"}
                                                                            onChange={() => onChange("false")}
                                                                        />
                                                                    )}
                                                                />
                                                                <label className={`form-check-label mr-2`} style={{ color: errors?.requireUpload ? 'red' : '', fontSize: 12, marginTop: 1, fontWeight: 500 }} htmlFor="female">
                                                                    No
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {errors?.requireUpload && (
                                                            <div style={{ color: "red" }} className="text-left">
                                                                {errors?.requireUpload?.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Start Date <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <Controller
                                                            name="startDate"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    className="input_fixed_width"
                                                                    type="date"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    min={isAdmin ? "1900-01-01" : new Date().toISOString().split("T")[0]} // Admin can select any date
                                                                />
                                                            )}
                                                            defaultValue=""
                                                        />
                                                        {errors.startDate && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors?.startDate?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Start Time <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <Controller
                                                            name="startTime"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    className="input_fixed_width"
                                                                    type="time"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                />
                                                            )}
                                                            defaultValue=""
                                                        />
                                                        {errors.startTime && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors?.startTime?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">End Date <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <Controller
                                                            name="endDate"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    className="input_fixed_width"
                                                                    type="date"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    min={isAdmin ? "1900-01-01" : new Date().toISOString().split("T")[0]} // Admin can select any date
                                                                />
                                                            )}
                                                            defaultValue=""
                                                        />
                                                        {errors.endDate && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors?.endDate?.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">End Time <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <Controller
                                                            name="endTime"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <input
                                                                    className="input_fixed_width"
                                                                    type="time"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                />
                                                            )}
                                                            defaultValue=""
                                                        />
                                                        {errors.endTime && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors?.endTime?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Phone Number </label>
                                                        <Controller
                                                            name="contact"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <PhoneInput
                                                                    country={"in"}
                                                                    value={value}
                                                                    onChange={(phone) => onChange(phone)}
                                                                />
                                                            )}
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                        <label className="text-left">Event Location <span style={{ color: '#F15B43' }}>*</span></label>
                                                        <Controller
                                                            name="location"
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <textarea
                                                                    className="input_fixed_width"
                                                                    type="text"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                />
                                                            )}
                                                            defaultValue=""
                                                        />
                                                        {errors?.location && (
                                                            <p style={{ color: "red", textAlign: 'left' }}>
                                                                {errors?.location?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                                                        <div className="mb-2 profile-photo-class">Additional Photo</div>
                                                        <label htmlFor="additionalThumbnail" className="input_fixed_width" style={{ lineHeight: 3 }}>Additional Photo</label>
                                                        <Controller
                                                            name="additionalThumbnail"
                                                            control={control}
                                                            render={({ field: { onChange, onBlur } }) => (
                                                                <>
                                                                    <input
                                                                        id="additionalThumbnail"
                                                                        type="file"
                                                                        multiple
                                                                        onChange={(e) => handleAdditionalThumbnail(e, onChange)}
                                                                        onBlur={onBlur}
                                                                        accept=".jpg,.jpeg,.png"
                                                                        className="form-control form-control-lg"
                                                                    />
                                                                    {additionalThumbnail.length > 0 && (
                                                                        <div className="preview-image-container">
                                                                            {additionalThumbnail.map((thumbnail, index) => (
                                                                                <div
                                                                                    key={index}
                                                                                    className="d-flex justify-content-between align-items-center mt-2 rounded w-100 bg-light pe-2"
                                                                                    style={{ backgroundColor: 'rgb(220 220 220)', overflow: 'hidden', border: '1px solid #cdcdcd' }}
                                                                                >
                                                                                    <Image
                                                                                        src={thumbnail}
                                                                                        alt={`Additional Thumbnail ${index + 1}`}
                                                                                        width={80} // Specify width
                                                                                        height={50} // Specify height
                                                                                        style={{ objectFit: 'cover' }} // Apply objectFit to match your style
                                                                                    />
                                                                                    <IoClose className="h5 mt-2" style={{ cursor: 'pointer' }} onClick={() => removeImageHandle(index)} />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-file">
                                                        <div className="mb-2 profile-photo-class">Thumbnail <span style={{ color: '#F15B43' }}>*</span></div>
                                                        <label htmlFor="thumbnail" className="input_fixed_width" style={{ lineHeight: 3 }}>Upload Photo</label>
                                                        <Controller
                                                            name="thumbnail"
                                                            control={control}
                                                            render={({
                                                                field: { value, onChange, onBlur },
                                                            }) => (
                                                                <>
                                                                    <input
                                                                        id="thumbnail"
                                                                        type="file"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0];
                                                                            if (
                                                                                file &&
                                                                                file.type.startsWith("image/")
                                                                            ) {
                                                                                const previewUrl =
                                                                                    URL.createObjectURL(file);
                                                                                setPreviewUrl(previewUrl);
                                                                                onChange(file);
                                                                            }
                                                                        }}
                                                                        onBlur={onBlur}
                                                                        accept=".jpeg,.jpg,.png"
                                                                        className="form-control form-control-lg"
                                                                    />
                                                                    {previewUrl && (
                                                                        <div className="preview-image-container" style={{ position: 'relative', width: '300px', height: '200px' }}>
                                                                            <Image
                                                                                src={previewUrl}
                                                                                alt="Preview"
                                                                                fill
                                                                                className="preview-image"
                                                                                style={{ objectFit: 'contain' }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        />
                                                        {errors?.thumbnail && (
                                                            <span
                                                                className="error-message"
                                                                style={{ color: "red", textAlign: 'left' }}
                                                            >
                                                                {errors?.thumbnail?.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="col-12 form-group">
                                                        <label className="text-left">
                                                            Event Description <span style={{ color: '#F15B43' }}>*</span>
                                                        </label>
                                                        <Controller
                                                            name="description"
                                                            control={control}
                                                            defaultValue=""
                                                            render={({ field: { value, onChange } }) => (
                                                                <QuillEditor
                                                                    value={value}
                                                                    onChange={onChange} />
                                                            )}
                                                        />
                                                        {errors?.description && <p style={{ color: "red" }}>{errors.description.message}</p>}
                                                    </div>
                                                    <div className="submit-area col-lg-12 col-12">
                                                        <Link href={backPath} className="button-round button-back">
                                                            Back to List
                                                        </Link>
                                                        <button type="submit" className="button-round">
                                                            Add Event
                                                        </button>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </>
            )}
        </>
    )
}

export default AddEventForm