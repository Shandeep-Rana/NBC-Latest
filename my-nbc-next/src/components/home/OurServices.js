"use client";
import Image from "next/image";
import React from "react";

const features = [
    {
        title: "Sustainable Tourism",
        description:
            "We promote eco-friendly travel that treads lightly on the environment. No engines. No emissions. Just fresh air and clean adventures.",
        img: "/images/our-features-img-1.png",
        icon: "/images/icon-our-features-1.png",
    },
    {
        title: "Cultural Revival",
        description:
            "We spotlight the hidden gems of Nangal's forgotten trails, untold stories, and the real flavor of Punjab that doesn’t make it into guidebooks.",
        img: "/images/our-features-img-2.png",
        icon: "/images/icon-our-features-2.png",
    },
    {
        title: "Local Empowerment",
        description:
            "Our rides support local guides, artisans, and farmers. Every tour is a step toward strengthening the community economy and celebrating regional talent.",
        img: "/images/our-features-img-3.jpg",
        icon: "/images/icon-our-features-3.png",
    },
];

const OurFeatures = () => {
    return (
        <div className="our-features">
            <div className="container">
                <div className="row section-row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h3 className="wow fadeInUp">our feature</h3>
                            <h2 className="text-anime-style-2" data-cursor="-opaque">
                                Here&apos;s how we&rsquo;re making a difference
                            </h2>
                            <p className="wow fadeInUp" data-wow-delay="0.2s">
                                At Nangal By Cycle, we&rsquo;re not just about rides, we&rsquo;re about
                                rewriting the story of tourism in Punjab, one pedal at a time.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="our-features-list">
                            {features.map((feature, index) => (
                                <div className="our-features-item" key={index}>
                                    <div className="our-features-image">
                                        <figure className="image-anime reveal">
                                            <Image
                                                src={feature.img}
                                                alt={feature.title}
                                                width={500}
                                                height={300}
                                                layout="responsive"
                                            />
                                        </figure>
                                    </div>

                                    <div className="our-features-content">
                                        <div className="our-features-body">
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                        <div className="icon-box">
                                            <Image
                                                src={feature.icon}
                                                alt={`${feature.title} icon`}
                                                width={60}
                                                height={60}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurFeatures;
