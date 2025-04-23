import React from "react";

const teamMembers = [
  {
    name: "Rohit Garg",
    role: "Founder",
    image: "images/team-1.jpg",
  },
  {
    name: "Lakshya Garg",
    role: "Co-Founder & Junior Developer",
    image: "images/team-2.jpg",
    delay: "0.2s",
  },
  {
    name: "Lavanya Garg",
    role: "Co-founder & Creative Designer",
    image: "images/team-3.jpg",
    delay: "0.4s",
  },
  {
    name: "Karan Chaudhary",
    role: "Brand Ambassador - NBC",
    image: "images/team-4.jpg",
    delay: "0.6s",
  },
  {
    name: "Tarun Kumar",
    role: "Director – Legal & Compliance",
    image: "images/team-5.jpg",
    delay: "0.8s",
  },
  {
    name: "Ajay Bansal",
    role: "Director - Content and Creativity",
    image: "images/team-6.jpg",
    delay: "1s",
  },
  {
    name: "Dr. Naresh",
    role: "Director - Health and Wellness",
    image: "images/team-7.jpg",
    delay: "1.2s",
  },
];

const Team = () => {
  return (
    <>
      <div className="page-header parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque">
                  <span>Our</span> team
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      team
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
            {teamMembers.map((member, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <div
                  className="team-item wow fadeInUp"
                  data-wow-delay={member.delay || "0s"}
                >
                  <div className="team-image">
                    <a href="/team-single.html" data-cursor-text="View">
                      <figure className="image-anime">
                        <img src={member.image} alt={member.name} />
                      </figure>
                    </a>
                  </div>
                  <div className="team-content">
                    <h3>
                      <a href="/team-single.html">{member.name}</a>
                    </h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Team;
