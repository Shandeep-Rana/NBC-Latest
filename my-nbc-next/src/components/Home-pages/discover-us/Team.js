"use client";

import { teamMembers } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Team = () => {
  const router = useRouter();

  const handleMemberClick = (id) => {
    router.push(`/discoverus/team-detail/${id}`);
  };

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
                      <Link href="/">home</Link>
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
                    <Link href="#"
                      onClick={() => handleMemberClick(member.id)}
                      data-cursor-text="View"
                    >
                      <figure className="image-anime">
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={500} // Set an appropriate width
                          height={300} // Set an appropriate height
                          layout="responsive" // Makes the image responsive, you can adjust based on design needs
                        />
                      </figure>

                    </Link>
                  </div>
                  <div className="team-content">
                    <h3
                      style={{ cursor: "pointer" }}
                      onClick={() => handleMemberClick(member.id)}
                    >
                      <Link href="#">{member.name}</Link>
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
