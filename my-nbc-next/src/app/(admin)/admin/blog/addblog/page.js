"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the component to prevent SSR
const AddBlogForm = dynamic(() => import('@/components/Forms/AddBlogForm'), {
  ssr: false,
});

const page = () => {
  return <AddBlogForm />;
};

export default page;
