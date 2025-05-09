'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AddEventForm = dynamic(() => import('@/components/Forms/AddEventForm'), {
  ssr: false,
});

const Page = () => {
  return <AddEventForm />;
};

export default Page;
