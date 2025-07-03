'use client';

import Loader from '@/common/Loader';
import { getEvent } from '@/Slice/events';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { numberToString, stringToNumber } from '@/constants/utils';

export default function EventView() {
  const { title } = useParams();
  const lastIndex = title.lastIndexOf("-");
  const eventId = title.substring(lastIndex + 1);
  const intID = stringToNumber(eventId);

  const dispatch = useDispatch();
  const { event, isLoading } = useSelector((state) => state.event);

  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    setLocalLoading(true);
    const delayDebounce = setTimeout(() => {
      if (intID)
        dispatch(getEvent(intID)).finally(() => {
          setLocalLoading(false);
        });
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      setLocalLoading(false);
    };
  }, [dispatch, intID]);

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user")) : null;

  const [state, setState] = useState({
    showModal: false,
    selectedEventId: null,
  });

  const closeModal = () => {
    setState({ showModal: false, selectedEventId: null });
  };

  const PopupModal = ({ onClose, eventId }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-10 rounded shadow-lg w-[90%] max-w-md relative">
        <button className="absolute top-3 right-3 text-xl" onClick={onClose}>
          &times;
        </button>
        <p className="font-bold mb-4">
          It looks like you’re not logged in! Not a member yet? Sign up now to join the event and be part of the experience!
        </p>
        <button
          className="bg-orange-600 text-white px-4 py-2 rounded m-2"
          onClick={() => (window.location.href = `/auth/skills?event=${numberToString(eventId)}`)}
        >
          Go to NBC Member Register
        </button>
        <button
          className="bg-orange-600 text-white px-4 py-2 rounded m-2"
          onClick={() => (window.location.href = `/auth/login?event=${numberToString(eventId)}`)}
        >
          Login
        </button>
      </div>
    </div>
  );

  const handleRegisterClick = (eventId) => {
    if (user) {
      window.location.href = `/event/participation/${numberToString(eventId)}`;
    } else {
      setState({ showModal: true, selectedEventId: eventId });
    }
  };

  const isExpired = new Date(event?.endDateTime) < new Date();

  return (
    <>
      {localLoading || isLoading ? (
        <Loader />
      ) : (
        <>
          {state.showModal && (
            <PopupModal onClose={closeModal} eventId={state.selectedEventId} />
          )}

          <div className="page-header parallaxie">
            <div className="container">
              <div className="row items-center">
                <div className="col-lg-12">
                  <div className="page-header-box">
                    <h1 className="text-anime-style-2" data-cursor="-opaque">
                      {event?.title}
                    </h1>
                    <nav className="wow fadeInUp">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link href="/">home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          <Link href="/events">event</Link>
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-single-post py-12">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">

                  <div className="post-image mb-6">
                    <figure className="image-anime reveal">
                      <Image
                        src={event?.imageUrl || "/images/post-1.jpg"}
                        alt={event?.title || "Event Image"}
                        width={1200}
                        height={600}
                        className="w-full h-auto"
                      />
                    </figure>
                  </div>

                  <div className="post-content space-y-6">
                    <div className="post-entry">
                      <h3 className="wow fadeInUp" data-wow-delay="0.8s">
                        {event?.subtitle || 'About The Event'}
                      </h3>

                      <div
                        className="wow fadeInUp"
                        data-wow-delay="0.2s"
                        dangerouslySetInnerHTML={{ __html: event?.description || '' }}
                      />

                      {event?.objectives && (
                        <>
                          <h3 className="wow fadeInUp" data-wow-delay="1s">
                            Objectives
                          </h3>
                          <ul className="list-disc list-inside wow fadeInUp" data-wow-delay="1.2s">
                            {event.objectives.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    <div className="post-tag-links">
                      <div className="row items-center">
                        <div className="col-lg-8">
                          <div className="post-tags wow fadeInUp" data-wow-delay="0.5s">
                            <span className="tag-links">
                              Tags:
                              {event?.tags?.map((tag, idx) => (
                                <Link key={idx} href="#" className="ml-2">
                                  {tag}
                                </Link>
                              ))}
                            </span>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="post-social-sharing wow fadeInUp" data-wow-delay="0.5s">
                            <ul className="flex space-x-4">
                              <li><Link href="#"><i className="fa-brands fa-facebook-f"></i></Link></li>
                              <li><Link href="#"><i className="fa-brands fa-linkedin-in"></i></Link></li>
                              <li><Link href="#"><i className="fa-brands fa-instagram"></i></Link></li>
                              <li><Link href="#"><i className="fa-brands fa-x-twitter"></i></Link></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isExpired && (
                      <div className="text-center mt-6">
                        <button
                          className="bg-orange-500 text-white px-6 py-3 rounded-md"
                          onClick={() => handleRegisterClick(event?.id)}
                        >
                          Register Now
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
      }
    </>
  );
}
