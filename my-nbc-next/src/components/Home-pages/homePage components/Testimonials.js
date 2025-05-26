"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const testimonials = [
    {
        name: "Anurag Yadav",
        title: "Chief Executive Officer\nGleneagles Healthcare India",
        image: "/images/author1.png",
        message: `I am truly inspired by your community support initiatives, which reflect a commendable approach to local engagement. Your efforts in volunteer and blood donor registration will undoubtedly save lives, while providing platforms for local blogs and service listings strengthens community connectivity. Promoting health awareness and best practices is crucial for regional well-being, and your work in this area is vital for societal growth.
      
      At Gleneagles Healthcare India, we share this dedication through initiatives like our 'Clean Hands' and Cervical Cancer awareness campaigns. Our 'Saksham - Entrepreneurship for Women' project supports marginalized women in starting businesses, and our 'Poshan & Promoting Menstrual Health and Hygiene' initiative has benefited over 2,000 children and 1,520 schoolgirls.`
    },

    {
        name: "Dheeraj Ramrana",
        title: "",
        image: "/images/author2.png",
        message: `"After my family benefited from Nangal By Cycle services, I knew I wanted to pay it forward. Their caring staff helped us through a difficult time, and I'm grateful to have the opportunity to help others through my donations."`,
    },
    {
        name: "Sanjeev Agarwala",
        title: "Founder and CEO at A R I A Consultancy\nDubai - UAE",
        image: "/images/author3.png",
        message: `Dear Rohit,

"It does not take long to say that this is an incredible initiative and super concept. The web site is also fantastic..."

"In summary, I believe this is what people look for…. “Purpose of Life”…. And I think you found one."`,
    },
];

const Testimonials = () => {
    return (
        <div className="our-testimonials">
            <div className="container">
                <div className="row align-items-center">
                    {/* Left Side Image */}
                    <div className="col-lg-6">
                        <div className="testimonials-image">
                            <div className="testimonials-img">
                                <figure className="image-anime reveal">
                                    <Image
                                        src="/images/testimonials-image.jpg"
                                        alt="Testimonials"
                                        width={600}
                                        height={400}
                                        layout="responsive"
                                    />
                                </figure>
                            </div>
                            <div className="client-review-box">
                                <h2>200+</h2>
                                <p>Volunteers</p>
                            </div>
                        </div>
                    </div>  

                    {/* Right Side Content */}
                    <div className="col-lg-6">
                        <div className="testimonials-content">
                            <div className="section-title">
                                <h3 className="wow fadeInUp">testimonials</h3>
                                <h2 className="text-anime-style-2" data-cursor="-opaque">
                                    What our happy donors say !!
                                </h2>
                            </div>
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                loop={true}
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: false,
                                }}
                                pagination={{ clickable: true }}
                                className="testimonial-slider"
                            >
                                {testimonials.map((testimonial, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="testimonial-item">
                                            <div className="testimonial-header">
                                                <div className="author-info">
                                                    <div className="author-image">
                                                        <figure className="image-anime">
                                                            <Image
                                                                src={testimonial.image}
                                                                alt={testimonial.name}
                                                                width={60}
                                                                height={60}
                                                            />
                                                        </figure>
                                                    </div>
                                                    <div className="author-content">
                                                        <h3>{testimonial.name}</h3>
                                                        <p>{testimonial.title}</p>
                                                    </div>
                                                </div>
                                                <div className="testimonial-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i className="fa-solid fa-star" key={i}></i>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="testimonial-content">
                                                <p>{testimonial.message}</p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
