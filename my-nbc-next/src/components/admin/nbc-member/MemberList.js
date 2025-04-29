"use client"

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import Link from "next/link"; // Use Next.js Link component
import moment from "moment";
import { Table } from "antd";
import { deleteSkilledPerson, getAllSkilledPersons, getSkilledPerson } from "@/Slice/skilledPerson";
import Loader from "@/common/Loader";

const MemberList = () => {
    const dispatch = useDispatch();
    const [selectedSkilledPerson, setSelectedSkilledPerson] = useState(null);
    const [isSkilledPersonViewModalOpen, setSkilledPersonViewModalOpen] = useState(false);
    const toggleSkilledPersonViewModal = () => setSkilledPersonViewModalOpen(!isSkilledPersonViewModalOpen);
    const { skilledPersons, totalCount, isLoading } = useSelector((state) => state.person);
    const [state, setState] = useState({
        search: "",
        page: 1,
        pagesize: 5,
    });

    useEffect(() => {
        dispatch(getAllSkilledPersons(state.search, state.page, state.pagesize));
    }, [dispatch, state.search, state.page, state.pagesize]);

    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD");
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

    const handleDelete = (id) => {
        dispatch(deleteSkilledPerson(id));
    };

    const handleViewClick = (id) => {
        setSelectedSkilledPerson(id);
        toggleSkilledPersonViewModal(id);
    };

    const handleUpdateClick = (id) => {
        dispatch(getSkilledPerson(id));
    }

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
            render: (text, record, index) => (
                index + 1
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
        },
        {
            title: 'Phone Number',
            dataIndex: 'mobile',
            sorter: (a, b) => a.mobile.length - b.mobile.length,
        },
        {
            title: 'Date Of Birth',
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
                    <Link href={`/admin/nbcmember/updatemember/${record.skilledPersonId}`}>
                        <button className="dropdown-item px-2 text-warning" onClick={() => { handleUpdateClick(record.skilledPersonId); }}>
                            <i className="fa fa-pencil m-r-5" />
                        </button>
                    </Link>

                    <Link href="#" passHref>
                        <button title="View Profile" className="dropdown-item px-2 text-primary" onClick={() => handleViewClick(record)}>
                            <i className="fa fa-user"></i>
                        </button>
                    </Link>

                    <Link href="#" passHref>
                        <button className="dropdown-item px-2 text-danger" onClick={() => { handleDeleteClick(record.skilledPersonId); }}>
                            <i className="fa fa-trash m-r-5" />
                        </button>
                    </Link>

                </div>
            ),
        },
    ];

    return (
        <>
            <div className="container-fluid mt-2">
                <div className="row justify-content-between align-items-center all_donor_header mb-2">
                    <div className="col-auto">
                        <h1 className="h2">NBC Members</h1>
                    </div>
                    <div className="col-auto">
                        <Link href="/admin/nbcmember/addmember" passHref>
                            <button className="button-round border_radius" type="button">
                                <i className="fa fa-plus" aria-hidden="true"></i> Add NBC member
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="row">
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
                            dataSource={skilledPersons}
                            rowKey={(record) => record.skilledPersonId}
                        />
                    )}
                </div>
                {/* <SkilledPersonModalView
          isSkilledPersonViewModalOpen={isSkilledPersonViewModalOpen}
          toggleSkilledPersonViewModal={toggleSkilledPersonViewModal}
          selectedSkilledPerson={selectedSkilledPerson}
        /> */}
            </div>
        </>
    );
};

export default MemberList;
