"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { Table } from 'antd';
import ReactSelect from "react-select";
import { GiCheckMark } from 'react-icons/gi';
import { getUserInfoFromToken, ROLES } from '@/constants';
import { attendedEvent, getAllEventParticipants, getALLEvents } from '@/Slice/events';
import Loader from '@/common/Loader';

const AllParticipantsList = () => {
  const dispatch = useDispatch();
  const { eventsWithoutPagination, isLoading, eventParticipants, totalCount } = useSelector(state => state.event);
  const userInfo = getUserInfoFromToken();

  const [state, setState] = useState({
    search: "",
    page: 1,
    pagesize: 10,
    selectedEvent: "",
  });

  const handleAttendedClick = (id) => {
    const data = { id: id };
    dispatch(attendedEvent(data));
  };

  useEffect(() => {
    dispatch(getALLEvents());
  }, [dispatch]);

  const eventOptions = [
    { value: "", label: "Select Event" },
    ...eventsWithoutPagination.map(event => ({
      value: event.eventId,
      label: event.title,
    }))
  ];

  useEffect(() => {
    dispatch(getAllEventParticipants(state.search, state.page, state.pagesize, state.selectedEvent));
  }, [dispatch, state.search, state.page, state.pagesize, state.selectedEvent]);

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
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Event',
      dataIndex: 'eventTitle',
      sorter: (a, b) => a.eventTitle.length - b.eventTitle.length,
    },
    {
      title: 'Phone Number',
      dataIndex: 'contact',
      sorter: (a, b) => a.contact.length - b.contact.length,
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex justify-content-around" data-popper-placement="bottom-end">
          {userInfo.roleName.includes(ROLES.Admin) && record.attended !== 1 && (
            <Link href="#" title="Attended" className="dropdown-item px-2 text-success" onClick={() => handleAttendedClick(record.id)}>
              <GiCheckMark />
            </Link>
          )}
          <Link href={`/admin/updateparticipant/${record.id}`} className="dropdown-item px-2 text-warning" onClick={() => { handleUpdateClick(record.id) }}>
            <i className="fa fa-pencil m-r-5" />
          </Link>
          <Link href="#" className="dropdown-item px-2 text-danger" onClick={() => { handleDeleteClick(record.id); }}>
            <i className="fa fa-trash m-r-5" />
          </Link>
        </div>
      ),
    },
  ];

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do this.",
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
    dispatch(deleteEventParticipant(id));
  };

  const handleUpdateClick = (id) => {
    // dispatch(getdonor(id)); Uncomment if needed for future updates
  };

  return (
    <div className="container-fluid mt-2">
      <div className='row justify-content-between align-items-center all_donor_header mb-2'>
        <div className='col-auto'>
          <h1 className='h2'>Event Participants List</h1>
        </div>
        <div className="col-auto">
          <Link href="/admin/addparticipant" className="button-round border_radius" type="button">
            <i className="fa fa-plus" aria-hidden="true"></i> Add Participant
          </Link>
        </div>
      </div>
      <div className='row'>
        <div className="col-md-3 col-lg-3 col-sm-3 mb-2 mb-lg-2">
          <ReactSelect
            options={eventOptions}
            onChange={(selectedOption) => {
              const selectedValue = selectedOption ? selectedOption.value : null;
              setState({ ...state, selectedEvent: selectedValue });
            }}
            placeholder="Select Event"
            styles={{
              control: (provided, state) => ({
                ...provided,
                border: "1px solid #B8BDC9",
                backgroundColor: 'white',
                minHeight: 45,
                height: 45,
                boxShadow: state.isFocused ? '0 0 0 2px transparent' : provided.boxShadow,
                '&:hover': {
                  border: "1px solid #B8BDC9",
                },
                display: 'flex',
                zIndex: 5,
              }),
              valueContainer: (provided) => ({
                ...provided,
                height: 45,
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px',
              }),
              input: (provided) => ({
                ...provided,
                margin: 0,
                padding: 0,
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                height: 45,
                display: 'flex',
                alignItems: 'center',
              }),
              placeholder: (provided) => ({
                ...provided,
                display: 'flex',
                alignItems: 'center',
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
            }}
          />
        </div>
        <div className="col-md-3 col-lg-3 col-sm-3 mb-2 mb-lg-2">
          <input type="text" className="form-control" placeholder="Search" value={state.search} onChange={(e) => setState({ ...state, search: e.target.value })} />
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <Table
            pagination={{
              current: state.page,
              pageSize: state.pagesize,
              total: totalCount,
              showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
              showSizeChanger: true,
              onShowSizeChange: onShowSizeChange,
              itemRender: itemRender,
              onChange: (page, pageSize) => setState({ ...state, page, pagesize: pageSize }),
            }}
            bordered
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={eventParticipants}
            rowKey={(record) => record.donorId}
          />
        )}
      </div>
    </div>
  );
};

export default AllParticipantsList;
