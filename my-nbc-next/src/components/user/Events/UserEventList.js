"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import { Table } from "antd";
import { deleteEvent, getAllEvents, userEvents } from "@/Slice/events";
import Loader from "@/common/Loader";
import { getUserInfoFromToken } from "@/constants";

const UserEventList = () => {
    const dispatch = useDispatch();

    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (userInfo) setUser(userInfo);
        setUserLoading(false);
    }, []);

    const id = user?.userId;

    const [state, setState] = useState({
        search: "",
        page: 1,
        pageSize: 5,
    });

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventViewModalOpen, setEventViewModalOpen] = useState(false);
    const toggleEventViewModal = () => setEventViewModalOpen(!isEventViewModalOpen);

    useEffect(() => {
        if (userLoading || !id) return; 

        dispatch(userEvents(state.search, state.page, state.pageSize, id));
    }, [dispatch, state.search, state.page, state.pageSize, id, userLoading]);

    const { userEvent, isLoading, totalCount } = useSelector((state) => state.event);

    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD HH:mm");
    };

    const handleDeleteClick = (id) => {
        confirmAlert({
            title: "Confirm to delete",
            message: "Are you sure to do this?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => handleDelete(id),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteEvent(id));
    };

    const handleViewClick = (event) => {
        setSelectedEvent(event);
        toggleEventViewModal(event);
    };

    const onShowSizeChange = (current, pageSize) => {
        setState({ ...state, page: 1, pageSize: pageSize });
    };

    const itemRender = (current, type, originalElement) => {
        if (type === "prev") {
            return <button className="btn btn-sm btn-primary">Previous</button>;
        }
        if (type === "next") {
            return <button className="btn btn-sm btn-primary">Next</button>;
        }
        return originalElement;
    };

    const columns = [
        {
            title: "#",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Event Title",
            dataIndex: "title",
            sorter: (a, b) => a.title.length - b.title.length,
        },
        {
            title: "Organiser Name",
            dataIndex: "organiser",
            sorter: (a, b) => a.organiser.length - b.organiser.length,
        },
        {
            title: "Phone Number",
            dataIndex: "contact",
            render: (text) => (text ? text : "XXXXXXXXXX"),
            sorter: (a, b) => (a.contact || "").length - (b.contact || "").length,
        },
        {
            title: "Start Date/Time",
            dataIndex: "startDateTime",
            render: (text) => formatDate(text),
        },
        {
            title: "End Date/Time",
            dataIndex: "endDateTime",
            render: (text) => formatDate(text),
        },
        {
            title: "Location",
            dataIndex: "location",
            sorter: (a, b) => a.location.length - b.location.length,
        },
        {
            title: "Action",
            render: (text, record) => (
                <div className="d-flex justify-content-around">
                    <Link href={`/user/event/updateevent/${record.eventId}`} passHref>
                        <button className="dropdown-item px-2 text-warning">
                            <i className="fa fa-pencil m-r-5" />
                        </button>
                    </Link>
                    <button
                        className="dropdown-item px-2 text-primary"
                        onClick={() => handleViewClick(record)}
                    >
                        <i className="fa fa-user" />
                    </button>
                    <button
                        className="dropdown-item px-2 text-danger"
                        onClick={() => handleDeleteClick(record.eventId)}
                    >
                        <i className="fa fa-trash m-r-5" />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <div className="container-fluid mt-2">
            <div className="row justify-content-between align-items-center all_donor_header mb-2">
                <div className="col-auto">
                    <h1 className="h2">Event List</h1>
                </div>
                <div className="col-auto">
                    <Link href="/user/events/addevent" passHref>
                        <button className="button-round border_radius" type="button">
                            <i className="fa fa-plus" aria-hidden="true"></i> Add Event
                        </button>
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 col-lg-3 col-sm-3 mb-2 mb-lg-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={state.search}
                        onChange={(e) => setState({ ...state, search: e.target.value })}
                    />
                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    <Table
                        pagination={{
                            current: state.page,
                            pageSize: state.pageSize,
                            total: totalCount,
                            showTotal: (total, range) =>
                                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            showSizeChanger: true,
                            onShowSizeChange: onShowSizeChange,
                            itemRender: itemRender,
                            onChange: (page, pageSize) =>
                                setState({ ...state, page, pageSize }),
                        }}
                        bordered
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        dataSource={userEvent}
                        rowKey={(record) => record.eventId}
                    />
                )}
            </div>

            {/* Optional Event Modal */}
            {/* <EventModelView
                isEventViewModalOpen={isEventViewModalOpen}
                toggleEventViewModal={toggleEventViewModal}
                selectedEvent={selectedEvent}
            /> */}
        </div>
    );
};

export default UserEventList;
