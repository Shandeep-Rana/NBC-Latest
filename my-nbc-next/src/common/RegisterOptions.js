'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { BiSolidDonateBlood } from 'react-icons/bi';
import { RiTeamFill } from 'react-icons/ri';
import { IoPersonAddSharp } from 'react-icons/io5';
import innerBannerImg1 from '@/Assets/Images/Event-bg-01-01.jpg';

const options = [
  {
    id: 'donor_register',
    label: 'Blood Donor',
    icon: <BiSolidDonateBlood className="text-4xl text-[#CB4B36]" />,
    href: '/auth/register?role=donor',
  },
  {
    id: 'volunteer_register',
    label: 'Volunteer',
    icon: <RiTeamFill className="text-4xl text-[#CB4B36]" />,
    href: '/auth/register?role=volunteer',
  },
  {
    id: 'nbc_member',
    label: 'NBC Member',
    icon: <IoPersonAddSharp className="text-4xl text-[#CB4B36]" />,
    href: '/auth/skills',
  },
];

export default function RegisterOptions() {
  const router = useRouter();
  const [selected, setSelected] = useState('');

  const handleSelect = (id, href) => {
    setSelected(id);
    router.push(href);
  };

  return (
    <main>
      <section className="relative h-64 w-full">
        <Image
          src={innerBannerImg1}
          alt="Register Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Register As</h1>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map(({ id, label, icon, href }) => (
          <button
            key={id}
            onClick={() => handleSelect(id, href)}
            className={`flex flex-col items-center p-6 border-2 rounded-xl transition-all duration-300 ${
              selected === id ? 'border-[#CB4B36] shadow-lg' : 'border-gray-200 hover:border-[#CB4B36]'
            }`}
          >
            <div className="mb-4">{icon}</div>
            <span className="text-lg font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
