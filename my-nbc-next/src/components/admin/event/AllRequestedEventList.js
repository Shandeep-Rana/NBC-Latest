'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Table } from "antd";
import { GiCheckMark } from "react-icons/gi";
import { confirmAlert } from "react-confirm-alert";
// import EventModelView from "@/components/admin/events/EventModelView";
import Link from "next/link";
import { approveEvent, deleteEvent, getAllRequestEvents } from "@/Slice/events";
import Loader from "@/common/Loader";

const AllRequestedEventList = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventViewModalOpen, setEventViewModalOpen] = useState(false);
  const { totalCount, eventRequests, isLoading } = useSelector((state) => state.event);
  const [state, setState] = useState({
    search: "",
    page: 1,
    pagesize: 5,
  });

  const toggleEventViewModal = () => setEventViewModalOpen(!isEventViewModalOpen);

  useEffect(() => {
    dispatch(getAllRequestEvents(state.search, state.page, state.pagesize));
  }, [dispatch, state.search, state.page, state.pagesize]);

  const formatDate = (date) => moment(date).format("YYYY-MM-DD HH:mm:ss");

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => dispatch(deleteEvent(id)),
        },
        { label: "No" },
      ],
    });
  };

  const handleApproveClick = (id) => {
    confirmAlert({
      title: "Confirm to approve",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => dispatch(approveEvent(id)),
        },
        { label: "No" },
      ],
    });
  };

  const handleViewClick = (event) => {
    setSelectedEvent(event);
    toggleEventViewModal();
  };

  const onShowSizeChange = (current, pageSize) => {
    setState({ ...state, page: 1, pagesize: pageSize });
  };

  const itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return <button className="btn btn-sm btn-primary">Previous</button>;
    }
    if (type === 'next') {
      return <button className="btn btn-sm btn-primary">Next</button>;
    }
    return originalElement;
  };

  const columns = [
    {
      title: '#',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Event Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: 'Organiser Name',
      dataIndex: 'organiser',
      sorter: (a, b) => a.organiser.length - b.organiser.length,
    },
    {
      title: 'Phone Number',
      dataIndex: 'contact',
      render: (text) => text || 'XXXXXXXXXX',
      sorter: (a, b) => (a.contact || '').length - (b.contact || '').length,
    },
    {
      title: 'Start Date/Time',
      dataIndex: 'startDateTime',
      render: (text) => formatDate(text),
    },
    {
      title: 'End Date/Time',
      dataIndex: 'endDateTime',
      render: (text) => formatDate(text),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: (a, b) => a.location.length - b.location.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex justify-content-around">
          <button
            className="btn text-success"
            onClick={() => handleApproveClick(record.eventId)}
            title="Approve"
          >
            <GiCheckMark />
          </button>
          <Link href={`/admin/event/updateevent/${record.eventId}`} passHref>
            <button className="btn text-warning">
              <i className="fa fa-pencil m-r-5" />
            </button>
          </Link>
          <button
            className="btn text-primary"
            onClick={() => handleViewClick(record)}
            title="View"
          >
            <i className="fa fa-user" />
          </button>
          <button
            className="btn text-danger"
            onClick={() => handleDeleteClick(record.eventId)}
            title="Delete"
          >
            <i className="fa fa-trash m-r-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid mt-2">
      <div className="row justify-content-between align-items-center all_donor_header mb-2">
        <div className="col-auto">
          <h1 className="h2">Un-Approved Event List</h1>
        </div>
        <div className="col-auto">
          <Link href="/admin/event/addevent" className="button-round border_radius">
            <i className="fa fa-plus" aria-hidden="true" /> Add Event
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mb-2">
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
              pageSize: state.pagesize,
              total: totalCount,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
              showSizeChanger: true,
              onShowSizeChange: onShowSizeChange,
              itemRender: itemRender,
              onChange: (page, pageSize) => setState({ ...state, page, pagesize: pageSize }),
            }}
            bordered
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={eventRequests}
            rowKey={(record) => record.eventId}
          />
        )}
      </div>
      {/* <EventModelView
        isEventViewModalOpen={isEventViewModalOpen}
        toggleEventViewModal={toggleEventViewModal}
        selectedEvent={selectedEvent}
      /> */}
    </div>
  );
};

export default AllRequestedEventList;
