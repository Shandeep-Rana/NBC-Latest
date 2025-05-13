"use client";
import Link from 'next/link';
import React from 'react';

const BecomeDonor = () => {
  return (
    <>
      {/* Page Header Start */}
      <div className="page-header parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque">
                  <span>Become</span> A Blood Donor
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Become a Blood Donor
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-team">
        <div className="container">
          <div className="row">
            <div className="post-content">
              <div className="post-entry">
                <h2 className="wow fadeInUp" data-wow-delay="0.8s">
                  Be a Nangal Hero: Donate Blood, Save Lives
                </h2>
                <p className="wow fadeInUp">
                  Are you ready to be a hero in someone&apos;s life? Imagine having the power to save lives with just a single act of kindness. That&apos;s the incredible opportunity you have when you become a blood donor. Every day, countless lives are saved because of generous donors like you. Whether it&apos;s a patient undergoing surgery, a cancer patient receiving treatment, or a trauma victim in need of immediate care, your blood donation can make all the difference.
                </p>
                <h5 className="wow fadeInUp" data-wow-delay="0.8s">
                  But the benefits of donating blood go beyond just saving lives. As an active blood donor, you&apos;re also contributing to the well-being of your community and society as a whole. Here&apos;s how:
                </h5>

                <ul className="wow fadeInUp" data-wow-delay="1.2s">
                  <li>
                    <b>Saving Lives:</b> Your blood donation can be the lifeline for someone in their darkest hour. It&apos;s a simple yet powerful way to give back to society and make a tangible difference in someone&apos;s life.
                  </li>
                  <li>
                    <b>Health Benefits:</b> Did you know that donating blood has health benefits for the donor too? Regular blood donation helps reduce the risk of heart disease, lowers cholesterol levels, and even helps in the prevention of certain types of cancers. Plus, it stimulates the production of new blood cells, keeping you healthy and rejuvenated.
                  </li>
                  <li>
                    <b>Community Impact:</b> By donating blood, you&apos;re actively participating in community service. You&apos;re showing compassion and solidarity with those in need, fostering a sense of unity and goodwill within your community.
                  </li>
                  <li>
                    <b>Emergency Preparedness:</b> Your blood donation ensures that there&apos;s an adequate supply of blood available for emergencies. Whether it&apos;s a natural disaster, a mass casualty event, or a medical emergency, your contribution helps ensure that blood is readily available to those who need it most.
                  </li>
                  <li>
                    <b>Personal Fulfillment:</b> There&apos;s a profound sense of fulfillment that comes from knowing you&apos;ve made a difference in someone&apos;s life. As a blood donor, you have the power to bring hope and healing to those who are suffering, leaving a lasting impact on both the recipients and their loved ones.
                  </li>
                </ul>

                <p className="wow fadeInUp" data-wow-delay="1.4s">
                  So why wait? Take the first step towards becoming a Nangal hero today by registering as a blood donor. Your generosity has the power to transform lives and inspire others to join this noble cause. Together, we can make a difference, one donation at a time. Join us in our mission to save lives and create a healthier, happier world for all.
                </p>
              </div>
            </div>
            <div
              className="mt-4 wow fadeInUp text-center"
              data-wow-delay="0.6s"
            >
              <Link href="#" className="text-white btn-default">
                Register as a Blood Donor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeDonor;
