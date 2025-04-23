'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getPaginatedEvents } from "@/Slice/events";
import moment from "moment";
import EventRegister from "@/common/EventRegister";
import EventRegisterModal from "@/common/EventRegisterModal";
import Loader from "@/common/Loader";
import { rewriteUrl } from "@/constants";
import { numberToString } from "@/constants/utils";

const Events = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    search: "",
    page: 1,
    pageSize: 9,
    showModal: false,
    selectedEventId: null,
  });

  const [localLoading, setLocalLoading] = useState(false);

  const user = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));

  const { clientAllEvents, hasMore, isLoading } = useSelector(
    (state) => state.event
  );

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const formatTime = (time) => moment(time).format("hh:mm A");
  const formatDate = (day) => moment(day).format("Do");
  const formatMonth = (month) => moment(month).format("MMM");

  useEffect(() => {
    setLocalLoading(true);

    const delayDebounce = setTimeout(() => {
      dispatch(getPaginatedEvents(state.page, state.pageSize)).finally(() => {
        setLocalLoading(false);
      });
    }, 1000);

    return () => {
      clearTimeout(delayDebounce);
      setLocalLoading(false);
    };
  }, [dispatch, state.page, state.pageSize]);

  const handleClick = () => {
    setState((prevState) => ({
      ...prevState,
      pageSize: prevState.pageSize + 9,
    }));
  };

  const closeModal = () => {
    setState((prevState) => ({
      ...prevState,
      showModal: false,
      selectedEventId: null,
    }));
  };

  const handleRegisterClick = (eventId) => {
    if (user) {
      window.location.href = `/event/participation/${eventId}`;
    } else {
      setState((prevState) => ({
        ...prevState,
        showModal: true,
        selectedEventId: eventId,
      }));
    }
  };

  return (
    <>
      {localLoading || isLoading ? (
        <Loader />
      ) : (
        <>

          <div className="page-header parallaxie">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-12">
                  <div className="page-header-box">
                    <h1 className="text-anime-style-2" data-cursor="-opaque">Events</h1>
                    <nav className="wow fadeInUp">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link href="/">home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          Events
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
                {clientAllEvents?.map((event) => (
                  <div className="col-lg-12 col-md-6" key={event.eventId}>
                    <div className="team-item wow fadeInUp" data-wow-delay="0.2s">
                      <div className="service-entry-content-list m-0">
                        <div className="service-entry-content-item">
                          <div className="service-entry-image">
                            <figure className="ul-event-img image-anime reveal">
                              <div className="position-relative" style={{ width: "100%", height: "300px" }}>
                                <Image
                                  src={event.imageUrl}
                                  alt={event.title}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded"
                                />
                              </div>
                              <span className="date">
                                {formatDate(event.startDateTime)} <span className="mt-2">{formatMonth(event.startDateTime)}</span>
                              </span>
                            </figure>
                          </div>

                          <div className="service-entry-content-box wow fadeInUp">
                            <div className="service-entry-content">
                              <h2 className="fw-bold mb-2">{event.title}</h2>
                              {(() => {
                                const parser = new DOMParser();
                                const htmlDoc = parser.parseFromString(event.description, "text/html");
                                const textElements = htmlDoc.querySelectorAll("p");
                                const parsedText = Array.from(textElements)
                                  .map((p) => p.innerText)
                                  .join(" ");
                                return <p>{truncateText(parsedText, 100)}</p>;
                              })()}
                              <Link
                                href={`/event/${rewriteUrl(event?.title)}-${numberToString(event?.eventId)}`}
                                className="ul-btn"
                              >
                                <i className="fas fa-angle-double-right"></i> Event Details
                              </Link>
                              <EventRegister
                                eventId={event.id}
                                isExpired={event.isExpired}
                                categoryId={event.categoryId}
                                onNotLoggedIn={handleRegisterClick}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <div className="col-12 text-center mt-4">
                    <button
                      className="ul-btn"
                      onClick={handleClick}
                      disabled={localLoading}
                    >
                      {localLoading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {state.showModal && (
            <EventRegisterModal onClose={closeModal} eventId={state.selectedEventId} />
          )}
        </>
      )}
    </>
  );
};

export default Events;
