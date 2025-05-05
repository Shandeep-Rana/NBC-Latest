"use client";

import { bloodRequirementSchema } from '@/lib/utils/UtilsSchemas';
import { getRequirementById, updateRequirement } from '@/Slice/bloodRequirement';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'; // ✅ Added useState
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const UpdateBloodRequirement = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isDelay, setIsDelay] = useState(true);

    useEffect(() => {
        const reloadData = async () => {
            dispatch(getRequirementById(id));
        };
        reloadData();
    }, [dispatch, id]); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDelay(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const { bloodRequirement, isLoading } = useSelector((state) => state.bloodRequirement);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(bloodRequirementSchema),
        defaultValues: {
            agreeToTerms: false,
        },
    });

    const formatDate = (date) => moment(date).format("YYYY-MM-DD");

    const onSubmit = (data) => {
        const requestData = {
            fullName: data?.name,
            email: data?.email.toLowerCase(),
            contact: data?.contact,
            requireDate: formatDate(data?.requirementDate),
            location: data?.location,
            description: data?.description,
            bloodType: data?.bloodType,
        };
        dispatch(updateRequirement(id, requestData)); 
    };

    return (
        <div>UpdateBloodRequirement</div>
    );
};

export default UpdateBloodRequirement;
