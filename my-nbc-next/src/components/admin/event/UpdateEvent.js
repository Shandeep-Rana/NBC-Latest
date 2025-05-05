"use client";

import Loader from '@/common/Loader';
import { EventTypeOptions } from '@/constants';
import { eventSchema } from '@/lib/eventSchema';
import { getAllEventCategories } from '@/Slice/eventCategory';
import { getEvent, updateEvent } from '@/Slice/events';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import PhoneInput from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from "react-select";

const extractNameFromUrl = (url) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const nameParts = filename.split('-');
    if (nameParts.length > 1) {
        return nameParts.slice(1).join('-').split('.')[0];
    }
    return filename.split('.')[0];
};

const UpdateEvent = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const { event, isLoading } = useSelector((state) => state.event);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [file, setFile] = useState(null);
    const [isDelay, setIsDelay] = useState(true);
    const [additionalThumbnail, setAdditionalThumbnail] = useState([]);
    const [cloneAdditionalThumbnail, setCloneAdditionalThumbnail] = useState([]);
    const [allowParticipants, setAllowParticipants] = useState(false);

    useEffect(() => {
        dispatch(getEvent(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (event?.allowParticipants === 1)
            setAllowParticipants(true);
    }, [event]);

    useEffect(() => {
        if (event) {
            setThumbnailUrl(event.imageUrl);
            let imagesArray = event.images.map((image) => image.imageUrl);
            setAdditionalThumbnail(imagesArray);

            fetch(event.imageUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const file = new File([blob], "thumbnail.jpg", { type: blob.type });
                    setFile(file);
                });

            let imageFileArrayPromises = event.images.map((image) => {
                return fetch(image.imageUrl)
                    .then((res) => res.blob())
                    .then((blob) => {
                        return new File([blob], extractNameFromUrl(image.imageUrl), { type: blob.type });
                    });
            });

            Promise.all(imageFileArrayPromises).then((files) => {
                setCloneAdditionalThumbnail(files);
            });
        }
    }, [event]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDelay(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

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

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(eventSchema),
    });

    const onSubmit = (data) => {
        const startDateTime = `${data?.startDate} ${data?.startTime}`;
        const endDateTime = `${data?.endDate} ${data?.endTime}`;
        const maxParticipants = data?.Participants === "true" ? data.maxParticipants : 0; // Use strict comparison
        const formData = new FormData();
        formData.append("title", data?.title);
        formData.append("organiser", data?.organiserName);
        formData.append("description", data?.description);
        formData.append("contact", data?.contact);
        formData.append("startDateTime", startDateTime);
        formData.append("endDateTime", endDateTime);
        formData.append("thumbnail", data?.thumbnail);
        formData.append("location", data?.location);
        formData.append("eventType", data?.eventType);
        formData.append("categoryId", data?.category);
        formData.append("requireUpload", data?.requireUpload);
        formData.append("allowParticipants", data?.Participants);
        formData.append("maxParticipants", maxParticipants);
        for (let i = 0; i < cloneAdditionalThumbnail.length; i++) {
            formData.append('additionalThumbnail', cloneAdditionalThumbnail[i]);
        }
        dispatch(updateEvent(id, formData,
            // navigate
        ));
    };

    useEffect(() => {
        dispatch(getAllEventCategories());
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDelay(false);
        }, 2000); // 1 second delay

        return () => clearTimeout(timer);
    }, []);

    const { eventCategories } = useSelector(state => state.eventCategory);

    const eventCategoryOptions = eventCategories.map(eventCategory => ({
        value: eventCategory.categoryId,
        label: eventCategory.categoryName
    }));

    const formatDate = (date) => moment(date).format("YYYY-MM-DD");
    const formatTime = (date) => moment(date).format("HH:mm");

    return (
        <>
            {
                isLoading || isDelay ? (
                    <Loader />
                ) : (
                    <div id="content">
                        <div className="row">
                            <div className="col-lg-12 col-md-8">
                                <div className="row my-4">
                                    <div className="text-center">
                                        <h3>Update Event</h3>
                                    </div>
                                    <div className="card-body pt-0"></div>
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
                                                                className="input_fixed_width"
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                                autoComplete="false"
                                                                data-bs-toggle="tooltip"
                                                                data-bs-placement="right"
                                                                title="As per Aadhar card or passport"
                                                            />
                                                        )}
                                                        defaultValue={event?.organiser}
                                                    />
                                                    {errors?.organiserName && (
                                                        <p style={{ color: "red", textAlign: 'left' }}>
                                                            {errors?.organiserName?.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                    <label className="text-left">Event Title <span style={{ color: '#F15B43' }}>*</span></label>
                                                    <Controller
                                                        name="title"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <input
                                                                className="input_fixed_width"
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                                autoComplete="false"
                                                                data-bs-toggle="tooltip"
                                                                data-bs-placement="right"
                                                                title="As per Aadhar card or passport"
                                                            />
                                                        )}
                                                        defaultValue={event?.title}
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
                                                        defaultValue={event?.eventType}
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
                                                                placeholder="Select Event Category"
                                                                options={eventCategoryOptions}
                                                                value={eventCategoryOptions.find(option => option.value === value)}
                                                                onChange={(selected) => onChange(selected ? selected.value : null)}
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
                                                        defaultValue={event?.categoryId}
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
                                                                name="Participants" // Corrected the spelling here
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
                                                                        value={true}
                                                                        checked={value === true}
                                                                        onChange={(e) => {
                                                                            onChange(true); // Set true for "Yes"
                                                                            setAllowParticipants(true); // Update state
                                                                        }}
                                                                    />
                                                                )}
                                                                defaultValue={event?.allowParticipants === 1} // Simplified boolean check
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
                                                                name="Participants" // Corrected the spelling here
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
                                                                        value={false}
                                                                        checked={value === false}
                                                                        onChange={(e) => {
                                                                            onChange(false); // Set false for "No"
                                                                            setAllowParticipants(false); // Update state
                                                                        }}
                                                                    />
                                                                )}
                                                                defaultValue={event?.allowParticipants !== 1} // Simplified boolean check
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
                                                {allowParticipants && (
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
                                                            defaultValue={event?.maxParticipants}
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
                                                                defaultValue={event?.requireUpload === 1 ? 'true' : 'false'}
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
                                                                defaultValue={event?.requireUpload}
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
                                                            />
                                                        )}
                                                        defaultValue={formatDate(event?.startDateTime)}
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
                                                        defaultValue={formatTime(event?.startDateTime)}
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
                                                            />
                                                        )}
                                                        defaultValue={formatDate(event?.endDateTime)}
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
                                                        defaultValue={formatTime(event?.endDateTime)}
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
                                                        defaultValue={event?.contact}
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
                                                        defaultValue={event?.location}
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
                                                        render={({
                                                            field: { value, onChange, onBlur },
                                                        }) => (
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
                                                                                <div style={{ position: 'relative', width: '80px', height: '50px' }}>
                                                                                    <Image
                                                                                        src={thumbnail}
                                                                                        alt={`Additional Thumbnail ${index + 1}`}
                                                                                        fill
                                                                                        style={{ objectFit: 'cover' }}
                                                                                        className="preview-image"
                                                                                    />
                                                                                </div>
                                                                                <IoClose className="h5 mt-2" style={{ cursor: 'pointer' }} onClick={() => removeImageHandle(index)} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                        defaultValue={cloneAdditionalThumbnail}
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
                                                                            setThumbnailUrl(previewUrl);
                                                                            onChange(file);
                                                                        }
                                                                    }}
                                                                    onBlur={onBlur}
                                                                    accept=".png,.jpg,.jpeg"
                                                                    className="form-control form-control-lg"
                                                                />
                                                            </>
                                                        )}
                                                        defaultValue={file}
                                                    />
                                                    {thumbnailUrl && (
                                                        <div className="preview-image-container" style={{ position: 'relative', width: '100px', height: '70px' }}>
                                                            <Image
                                                                src={thumbnailUrl}
                                                                alt="Preview"
                                                                fill
                                                                style={{ objectFit: 'cover' }}
                                                                className="preview-image"
                                                            />
                                                        </div>
                                                    )}
                                                    {errors?.thumbnail && (
                                                        <span
                                                            className="error-message"
                                                            style={{ color: "red", textAlign: 'left' }}
                                                        >
                                                            {errors?.thumbnail?.message}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* <div className="form-group">
                                                    <label className="text-left">Event Description <span style={{ color: '#F15B43' }}>*</span></label>
                                                    <Controller
                                                        name="description"
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <ReactQuill
                                                                className="react_quill_editor"
                                                                modules={{
                                                                    toolbar: {
                                                                        container: [
                                                                            [{ header: [1, 2, 3, 4, 5, 6] }],
                                                                            [{ font: [] }],
                                                                            [{ size: [] }],
                                                                            ["bold", "italic", "underline"],
                                                                            [{ list: "ordered" }, { list: "bullet" }],
                                                                        ],
                                                                        handlers: {},
                                                                    },
                                                                }}
                                                                value={value}
                                                                onChange={onChange}
                                                            />
                                                        )}
                                                        defaultValue={event?.description}
                                                    />
                                                    {errors?.description && (
                                                        <p style={{ color: "red", textAlign: 'left' }}>
                                                            {errors?.description?.message}
                                                        </p>
                                                    )}
                                                </div> */}
                                                <div className="submit-area col-lg-12 col-12">
                                                    <Link href="/admin/all-events" className="button-round button-back">
                                                        Back to List
                                                    </Link>
                                                    <button type="submit" className="button-round">
                                                        Update Event
                                                    </button>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>
                                        </form >
                                    </div >
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </>
    )
}

export default UpdateEvent