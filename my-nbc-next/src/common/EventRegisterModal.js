import React from "react";

const EventRegisterModal = ({ onClose, eventId }) => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "40px",
                    borderRadius: "8px",
                    textAlign: "center",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    width: "400px",
                    maxWidth: "80%",
                    position: "relative",
                }}
            >
                <button
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                    onClick={onClose}
                >
                    &times;
                </button>

                <b>
                    <p>
                        "It looks like you’re not logged in! Not a member yet? Sign up now
                        to join the event and be part of the experience!".
                    </p>
                </b>
                <button
                    style={{
                        backgroundColor: "#f15b43",
                        color: "white",
                        padding: "10px 20px",
                        margin: "10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                    onClick={() =>
                    (window.location.href = `/auth/skills?event=${numberToString(
                        eventId
                    )}`)
                    }
                >
                    Go to NBC Member Register
                </button>
                <button
                    style={{
                        backgroundColor: "#f15b43",
                        color: "white",
                        padding: "10px 20px",
                        margin: "10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                    onClick={() =>
                    (window.location.href = `/auth/login?event=${numberToString(
                        eventId
                    )}`)
                    }
                >
                    Login
                </button>
            </div>
        </div>
    );
};


export default EventRegisterModal;