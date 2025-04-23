import React from 'react'
import { numberToString } from '@/constants/utils';
import Link from 'next/link';

const EventRegister = ({ eventId, isExpired, categoryId, onNotLoggedIn }) => {

    const user = JSON.parse(localStorage.getItem("user"));

    const handleClick = () => {
        if (user) {
            window.location.href = `/event/participation/${numberToString(eventId)}`;
        } else {
            if (onNotLoggedIn) {
                onNotLoggedIn(eventId);
            } else {
                window.location.href = `/auth/login?event=${numberToString(eventId)}`;
            }
        }
    };

    if (isExpired || categoryId !== 31) return null;

    return (
        <Link href={''} className="ul-btn" onClick={handleClick}>
            <i className="fas fa-angle-double-right"></i>  Register
        </Link>
    );
};

export default EventRegister