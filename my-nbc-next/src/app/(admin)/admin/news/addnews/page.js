'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AddNewsForm = dynamic(() => import('@/components/Forms/AddNewsForm'), {
  ssr: false,
});

const Page = () => {
  return <AddNewsForm />;
};

export default Page;
