"use client"

import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import Loader from "@/common/Loader";
import { getAllIntrests, getAllProfessions, getAllVillages } from "@/Slice/master";
import { UpgradeToMember, UpgradeToVolunteer } from "@/Slice/authRegister";
import { emailrgx } from "@/constants";

// Validation schemas
const emailSchema = yup.object({
    email: yup
        .string()
        .matches(emailrgx, "Invalid Email")
        .required("Email is required")
        .trim(),
}).required();

const upgradeSchema = yup.object({
    profession: yup.string().required("Profession is required"),
    interest: yup.string().required("Interest is required"),
    password: yup.string().required("Password is required"),
    cpassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
}).required();

const UpgradeDonorToVolunteer = ({ isOpen, toggleModal }) => {

    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.userRegister);
    const { interests, professions } = useSelector((state) => state.masterSlice);

    const [step, setStep] = useState(1);
    const [selectedIntrestOption, setSelectedIntrestOption] = useState(null);
    const [selectedProfessionOption, setSelectedProfessionOption] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        dispatch(getAllProfessions());
        dispatch(getAllVillages());
        dispatch(getAllIntrests());
    }, [dispatch]);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(step === 1 ? emailSchema : upgradeSchema),
    });

    const onSubmitEmail = async (data) => {
        const requestData = { email: data?.email.toLowerCase() };
        dispatch(VerifyEmailForDonorToVolunteer(requestData, () => setStep(2)));
    };

    const onSubmitUpgrade = async (data) => {
        const requestData = {
            email: data?.email,
            password: data?.password,
            profession: selectedProfessionOption,
            interest: selectedIntrestOption,
        };

        if (selectedRole === "Volunteer") {
            dispatch(UpgradeToVolunteer(requestData, toggleModal));
        } else if (selectedRole === "Member") {
            dispatch(UpgradeToMember(requestData, toggleModal));
        }
    };

    const handleSelectProfessionChange = (selected) => {
        setSelectedProfessionOption(selected?.value === "other" ? "other" : selected?.value);
    };

    const handleSelectInterestChange = (selected) => {
        setSelectedIntrestOption(selected?.value === "other" ? "other" : selected?.value);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const ProfessionsOptions = professions?.map((profession) => ({
        value: profession.professionName,
        label: profession.professionName,
    }));
    ProfessionsOptions.push({ value: "other", label: "Other" });

    const InterestsOptions = interests?.map((interest) => ({
        value: interest.interest,
        label: interest.interest,
    }));
    InterestsOptions.push({ value: "other", label: "Other" });

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggleModal}
            centered
            style={{
                animation: 'fadeIn 0.5s ease-in-out',
            }}
        >
            <ModalHeader toggle={toggleModal}>
                <div style={styles.stepIndicator}>
                    Step {step} / 2
                </div>
                {step === 1 ? "Email Verification" : "Donor Upgrade"}
            </ModalHeader>
            <ModalBody>
                {isLoading ? (
                    <Loader />
                ) : step === 1 ? (
                    <div
                        style={{
                            ...styles.container,
                            animation: 'stepFadeIn 0.5s ease-in-out',
                        }}
                    >
                        <form onSubmit={handleSubmit(onSubmitEmail)} style={styles.form}>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Select Role <span style={styles.required}>*</span>
                                </label>
                                <div style={styles.radioGroup}>
                                    <label className={`form-check-label mr-2`} style={{ color: errors?.donorGender ? 'red' : '', fontSize: 14, marginTop: 1, fontWeight: 500 }} htmlFor="Volunteer">
                                        <input
                                            style={{ border: errors?.registerType ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                                            type="radio"
                                            value="Volunteer"
                                            checked={selectedRole === "Volunteer"}
                                            onChange={handleRoleChange}
                                            className={`form-check-input`}
                                        />
                                        Volunteer
                                    </label>
                                    <label className={`form-check-label mr-2`} style={{ color: errors?.donorGender ? 'red' : '', fontSize: 14, marginTop: 1, fontWeight: 500 }} htmlFor="Member">
                                        <input
                                            style={{ border: errors?.registerType ? '1px solid red' : '1px solid #B8BDC9', borderRadius: '1px' }}
                                            type="radio"
                                            value="Member"
                                            checked={selectedRole === "Member"}
                                            onChange={handleRoleChange}
                                            className={`form-check-input`}
                                        />
                                        Member
                                    </label>
                                </div>
                            </div>
                            {selectedRole && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Email Address <span style={styles.required}>*</span>
                                    </label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={onChange}
                                                style={{
                                                    ...styles.input,
                                                    borderColor: errors?.email ? "red" : "#ced4da",
                                                }}
                                            />
                                        )}
                                        defaultValue=""
                                    />
                                    {errors?.email && (
                                        <p style={styles.errorText}>{errors?.email.message}</p>
                                    )}
                                </div>
                            )}
                            <button type="submit" style={styles.submitButton}>
                                Submit
                            </button>
                        </form>
                    </div>
                ) : (
                    <div
                        style={{
                            ...styles.container,
                            animation: 'stepFadeIn 0.5s ease-in-out',
                        }}
                    >
                        <form onSubmit={handleSubmit(onSubmitUpgrade)} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Current Profession <span style={styles.required}>*</span>
                                </label>
                                {selectedProfessionOption === "other" ? (
                                    <Controller
                                        name="profession"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Current Profession"
                                                style={styles.input}
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                            />
                                        )}
                                    />
                                ) : (
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
                                                onChange={(selected) => {
                                                    if (selected?.value !== "other") {
                                                        onChange(selected?.value);
                                                    } else {
                                                        onChange("");
                                                    }
                                                    handleSelectProfessionChange(selected);
                                                }}
                                                isClearable
                                                isSearchable
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        borderColor: errors?.profession
                                                            ? "red"
                                                            : "#B8BDC9",
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                                {errors?.profession && (
                                    <div style={styles.errorText}>{errors?.profession?.message}</div>
                                )}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    User Interest <span style={styles.required}>*</span>
                                </label>
                                {selectedIntrestOption === "other" ? (
                                    <Controller
                                        name="interest"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter User Interest"
                                                style={styles.input}
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                            />
                                        )}
                                    />
                                ) : (
                                    <Controller
                                        name="interest"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <ReactSelect
                                                placeholder="User Interest"
                                                options={InterestsOptions}
                                                value={InterestsOptions.find(
                                                    (option) => option.value === value
                                                )}
                                                onChange={(selected) => {
                                                    if (selected?.value !== "other") {
                                                        onChange(selected?.value);
                                                    } else {
                                                        onChange("");
                                                    }
                                                    handleSelectInterestChange(selected);
                                                }}
                                                isClearable
                                                isSearchable
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        borderColor: errors?.interest
                                                            ? "red"
                                                            : "#B8BDC9",
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                                {errors?.interest && (
                                    <div style={styles.errorText}>{errors?.interest?.message}</div>
                                )}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Password <span style={styles.required}>*</span>
                                </label>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <input
                                            placeholder="Password"
                                            type="password"
                                            style={styles.input}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                {errors?.password && (
                                    <div style={styles.errorText}>{errors?.password?.message}</div>
                                )}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Confirm Password <span style={styles.required}>*</span>
                                </label>
                                <Controller
                                    name="cpassword"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <input
                                            placeholder="Confirm Password"
                                            type="password"
                                            style={styles.input}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                {errors?.cpassword && (
                                    <div style={styles.errorText}>{errors?.cpassword?.message}</div>
                                )}
                            </div>

                            <button type="submit" style={styles.submitButton}>
                                Submit
                            </button>
                        </form>
                    </div>
                )}
            </ModalBody>
        </Modal>
    );
};

const styles = {
    container: {
        padding: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    formGroup: {
        marginBottom: "15px",
    },
    label: {
        display: "block",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #ced4da",
        marginTop: "5px",
    },
    submitButton: {
        backgroundColor: "#f15b43",
        color: "#ffffff",
        border: "none",
        padding: "10px 15px",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    required: {
        color: "red",
    },
    errorText: {
        color: "red",
        fontSize: "0.875em",
        marginTop: "5px",
    },
    stepIndicator: {
        fontSize: "1.25em",
        marginBottom: "10px",
        color: "black"
    },
    radioGroup: {
        display: "flex",
        gap: "15px",
    },
    radioLabel: {
        display: "flex",
        alignItems: "center",
    },
};

export default UpgradeDonorToVolunteer;
