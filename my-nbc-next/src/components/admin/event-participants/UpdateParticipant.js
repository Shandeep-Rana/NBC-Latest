"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-datepicker/dist/react-datepicker.css";
import ReactSelect from "react-select";
import { getEventParticipant, getPaginatedEvents, UpdateEventParticipantbyId } from "@/Slice/events";
import { eventparticipantSchema } from "@/lib/eventSchema";
import AdminLoader from "@/common/AdminLoader";
import { useParams, useRouter } from "next/navigation";


const UpdateParticipant = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = useParams();
    const [isDelay, setIsDelay] = useState(true);

    useEffect(() => {
        const reloadData = async () => {
            dispatch(getEventParticipant(id));
        };
        reloadData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDelay(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const { clientAllEvents, eventParticipant, isLoading } = useSelector(state => state.event);

    const [state, setState] = useState({
        search: "",
        page: 1,
        pageSize: 100,
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(eventparticipantSchema),
        defaultValues: {
            agreeToTerms: false,
        },
    });

    useEffect(() => {
        dispatch(getPaginatedEvents(state.page, state.pageSize));
    }, [dispatch, state.page, state.pageSize]);

    const eventOptions = clientAllEvents.map(event => ({
        value: event.eventId,
        label: event.title
    }));

    const onSubmit = (data) => {
        const requestData = {
            name: data?.name,
            email: data?.email.toLowerCase(),
            contact: data?.contact,
            event: data?.event?.value
        };
        dispatch(UpdateEventParticipantbyId(id, requestData, router));
    };

    return (
        <>
            {
                isLoading || isDelay ? (
                    <AdminLoader />
                ) : (
                    <div id="content">
                        <div className="row justify-content-center">
                            <div className="col-lg-12 col-md-10">
                                <div className="row my-4">
                                    <div className="text-center">
                                        <h3>Update Event Participant</h3>
                                    </div>
                                    <div className="card-body pt-0">
                                        <div className="volunteer-contact-form">
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
                                                            defaultValue={eventParticipant?.name}
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
                                                            defaultValue={eventParticipant?.email}
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
                                                            defaultValue={eventParticipant?.contact}
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
                                                                    onChange={(selected) => onChange(selected)}
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
                                                            defaultValue={eventOptions.find(option => option.value === eventParticipant?.event_id)}
                                                        />
                                                        {errors?.event && (
                                                            <div style={{ color: "red" }} className="text-left">{errors?.event?.message}</div>
                                                        )}
                                                    </div>
                                                    <div className="submit-area col-lg-12 col-12">
                                                        <button type="submit" className="button-round">
                                                            Update Participant
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
    );
}

export default UpdateParticipant