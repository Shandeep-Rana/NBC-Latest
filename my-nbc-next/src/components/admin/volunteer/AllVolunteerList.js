"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import Link from "next/link"; // Use Next.js Link for routing
import moment from "moment";
import { Table } from "antd";
import { deleteVolunteer, getAllVolunteers } from "@/Slice/volunteers";
import Loader from "@/common/Loader";

const AllVolunteerList = () => {
    const dispatch = useDispatch();

    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isVolunteerViewModalOpen, setVolunteerViewModalOpen] = useState(false);
    const { volunteers, isLoading, totalCount } = useSelector((state) => state.user);
    const [state, setState] = useState({
        search: "",
        page: 1,
        pagesize: 5,
    });

    useEffect(() => {
        dispatch(getAllVolunteers(state.search, state.page, state.pagesize));
    }, [dispatch, state.search, state.page, state.pagesize]);

    const toggleVolunteerViewModal = () => setVolunteerViewModalOpen(!isVolunteerViewModalOpen);
    const formatDate = (date) => moment(date).format("YYYY-MM-DD");
    const handleDelete = (id) => dispatch(deleteVolunteer(id));

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

    const handleViewClick = (id) => {
        setSelectedVolunteer(id);
        toggleVolunteerViewModal(id);
    };


    const columns = [
        {
            title: '#',
            render: (text, record, index) => (
                index + 1
            ),
        },
        {
            title: 'Volunteer Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
        },
        {
            title: 'Contact',
            dataIndex: 'mobile',
            sorter: (a, b) => a.mobile.length - b.mobile.length,
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            render: (text, record, index) => (
                formatDate(text)
            ),
            sorter: (a, b) => a.dob.length - b.dob.length,
        },
        {
            title: "Action",
            render: (text, record) => (
                <div className="d-flex justify-content-around" data-popper-placement="bottom-end">
                    <Link
                        href={`/admin/update-volunteer/${record.volunteerId}`} // Using Next.js Link for routing
                        className="dropdown-item px-2 text-warning"
                    >
                        <i className={`fa fa-pencil`}></i>
                    </Link>
                    <Link href="#"
                        title="View Profile"
                        className="dropdown-item px-2 text-primary"
                        onClick={() => handleViewClick(record)}
                    >
                        <i className={`fa fa-user`}></i>
                    </Link>
                    <Link className="dropdown-item px-2 text-danger" href="#" onClick={() => {
                        handleDeleteClick(record.volunteerId);
                    }}>
                        <i className="fa fa-trash m-r-5" />
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="container-fluid mt-2">
                <div className='row justify-content-between align-items-center all_donor_header mb-2'>
                    <div className='col-auto'>
                        <h1 className='h2'>Volunteer List</h1>
                    </div>
                    <div className="col-auto">
                        <Link href="/admin/add-volunteer" className={`button-round border_radius`} type="button">
                            <i className={`fa fa-plus`} aria-hidden="true"></i> Add Volunteer
                        </Link>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-3 col-lg-3 col-sm-3 mb-2 mb-lg-2">
                        <input type="text" className="form-control" placeholder="Search" value={state.search} onChange={(e) => setState({ ...state, search: e.target.value })} />
                    </div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Table
                            bordered
                            pagination={{
                                current: state.page,
                                pageSize: state.pagesize,
                                total: totalCount,
                                showTotal: (total, range) =>
                                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                showSizeChanger: true,
                                onShowSizeChange: onShowSizeChange,
                                itemRender: itemRender,
                                onChange: (page, pageSize) =>
                                    setState({ ...state, page, pagesize: pageSize }),
                            }}
                            style={{ overflowX: "auto" }}
                            columns={columns}
                            dataSource={volunteers}
                            rowKey={(record) => record.volunteerId}
                        />
                    )}
                </div>
                {/* <VolunteerModalView
                    isVolunteerViewModalOpen={isVolunteerViewModalOpen}
                    toggleVolunteerViewModal={toggleVolunteerViewModal}
                    selectedVolunteer={selectedVolunteer}
                /> */}
            </div>
        </>
    );
};

export default AllVolunteerList;
