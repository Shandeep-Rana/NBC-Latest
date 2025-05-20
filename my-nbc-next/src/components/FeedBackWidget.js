"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Head from "next/head";
import Loader from "@/common/Loader";
import Link from "next/link";
import { addFeedback } from "@/Slice/feedback";

const FeedBackWidget = () => {
    const [step, setStep] = useState(1);
    const [rating, setRating] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
    });

    const dispatch = useDispatch();
    const router = useRouter();

    const { isLoading } = useSelector((state) => state.feedback);

    const handleRating = (rate) => {
        setRating(rate);
        setStep(2);
    };

    const handleFeedbackSubmit = () => {
        if (feedback) {
            setStep(3);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const feedbackData = {
            stars: rating,
            description: feedback,
            ...formData,
        };
        dispatch(addFeedback(feedbackData, router));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, contact: value });
    };

    return (
        <>
            <Head>
                <title>Contact Nangal By Cycle | Book Your Bicycle Adventure Today</title>
                <meta
                    name="description"
                    content="Get in touch with Nangal By Cycle for tour bookings, rental inquiries, or custom cycling experiences. Start planning your eco-friendly Nangal adventure now."
                />
            </Head>

            {isLoading ? (
                <Loader />
            ) : (
                <main id="content" className="site-main">
                    <div className="page-header parallaxie">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <div className="page-header-box">
                                        <h1 className="text-anime-style-2" data-cursor="-opaque">
                                            <span>Member</span> FeedBack
                                        </h1>
                                        <nav className="wow fadeInUp">
                                            <ol className="breadcrumb">
                                                <li className="breadcrumb-item">
                                                    <Link href="/">Home</Link>
                                                </li>
                                                <li className="breadcrumb-item active" aria-current="page">
                                                    FeedBack
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contact-page-section">
                        <div className="contact-form-inner">
                            <div className="container">
                                <div
                                    style={{
                                        width: "400px",
                                        margin: "0 auto",
                                        fontFamily: "Arial, sans-serif",
                                        backgroundColor: "#ffffff",
                                        padding: "30px",
                                        borderRadius: "10px",
                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                                        transition: "transform 0.3s ease",
                                    }}
                                >
                                    {step === 1 && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <h3 style={{ marginBottom: "20px", color: "#333" }}>Rate Us</h3>
                                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        onClick={() => handleRating(star)}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill={rating >= star ? "#FFD700" : "#DDDDDD"}
                                                        width="30px"
                                                        height="30px"
                                                        style={{
                                                            cursor: "pointer",
                                                            margin: "0 5px",
                                                            transition: "fill 0.2s ease-in-out, stroke 0.2s ease-in-out",
                                                            outline: "none",
                                                        }}
                                                        role="radio"
                                                        aria-label={`${star} star`}
                                                        aria-checked={rating === star}
                                                        tabIndex="0"
                                                    >
                                                        <path
                                                            stroke="black"
                                                            strokeWidth="1"
                                                            fill={rating >= star ? "#FFD700" : "#DDDDDD"}
                                                            d="M12 .587l3.668 7.431 8.21 1.2-5.938 5.787 1.405 8.195L12 18.897l-7.345 3.863 1.405-8.195L.122 9.218l8.21-1.2z"
                                                        />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <h3 style={{ marginBottom: "15px", color: "#333" }}>Feedback</h3>
                                            <div className="feedback-cart-inner">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill={rating >= star ? "#FFD700" : "#DDDDDD"}
                                                        onClick={() => handleRating(star)}
                                                        width="30px"
                                                        height="30px"
                                                        style={{
                                                            margin: "0 5px",
                                                            transition: "fill 0.2s ease-in-out, stroke 0.2s ease-in-out",
                                                            outline: "none",
                                                            cursor: "pointer",
                                                        }}
                                                        role="radio"
                                                        aria-label={`${star} star`}
                                                        aria-checked={rating === star}
                                                        tabIndex="0"
                                                    >
                                                        <path
                                                            stroke="black"
                                                            strokeWidth="1"
                                                            fill={rating >= star ? "#FFD700" : "#DDDDDD"}
                                                            d="M12 .587l3.668 7.431 8.21 1.2-5.938 5.787 1.405 8.195L12 18.897l-7.345 3.863 1.405-8.195L.122 9.218l8.21-1.2z"
                                                        />
                                                    </svg>
                                                ))}
                                            </div>
                                            <textarea
                                                className="feedback-text"
                                                placeholder="Enter your feedback here..."
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                style={{ borderColor: feedback ? "#007bff" : "#cccccc" }}
                                            ></textarea>
                                            <button
                                                style={{
                                                    backgroundColor: feedback ? "#f15b43" : "#cccccc",
                                                    cursor: feedback ? "pointer" : "not-allowed",
                                                    boxShadow: feedback ? "0 4px 8px rgba(241, 91, 67, 0.3)" : "none",
                                                }}
                                                className="feedback-btn"
                                                onClick={handleFeedbackSubmit}
                                                disabled={!feedback}
                                            >
                                                Submit Feedback
                                            </button>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <h3 style={{ marginBottom: "20px", color: "#333" }}>Your Details</h3>
                                            <form
                                                onSubmit={handleFormSubmit}
                                                style={{ display: "flex", flexDirection: "column", width: "100%" }}
                                            >
                                                <label>Full Name:</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="feedback-in-email"
                                                    placeholder="Name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <label>E-mail:</label>
                                                <input
                                                    className="feedback-in-email"
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <label>Phone:</label>
                                                <PhoneInput
                                                    country={"in"}
                                                    value={formData.contact}
                                                    onChange={handlePhoneChange}
                                                    inputProps={{ required: true, name: "contact" }}
                                                />
                                                <br />
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <button type="button" onClick={handlePreviousStep} className="feedback-submit">
                                                        Previous
                                                    </button>
                                                    <button type="submit" className="feedback-submit">
                                                        Submit
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};

export default FeedBackWidget;