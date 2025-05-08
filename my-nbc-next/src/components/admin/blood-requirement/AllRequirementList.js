"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import { GiCheckMark } from 'react-icons/gi';
import { FcCancel } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { confirmAlert } from 'react-confirm-alert';
import { BloodGroupOptions, getUserInfoFromToken, ROLES } from '@/constants';
import { approveBloodRequirement, disApproveBloodRequirement, getPaginatedRequests } from '@/Slice/bloodRequirement';
import Loader from '@/common/Loader';

const AllRequirementList = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const userInfo = getUserInfoFromToken();

    const [selectedDonor, setSelectedDonor] = useState(null);
    const { bloodRequirementList, bloodRequirementCount, isLoading } = useSelector((state) => state.bloodRequirement);

    const [state, setState] = useState({
        search: "",
        page: 1,
        pagesize: 5,
        selectedBloodGroup: "",
    });

    useEffect(() => {
        dispatch(getPaginatedRequests(state.search, state.page, state.pagesize, state.selectedBloodGroup));
    }, [dispatch, state.search, state.page, state.pagesize, state.selectedBloodGroup]);

    const optionsBloodGroup = useMemo(() => {
        return BloodGroupOptions?.map((option) => ({
            value: option.value,
            label: option.label,
        }));
    }, []);

    const handleApproveClick = (id) => {
        dispatch(approveBloodRequirement({ reqId: id, userId: userInfo.userId }));
    };

    const handleDisApproveCLick = (id) => {
        dispatch(disApproveBloodRequirement({ reqId: id, userId: userInfo.userId }));
    };

    const onShowSizeChange = (current, pageSize) => {
        setState({ ...state, page: 1, pagesize: pageSize });
    };

    const itemRender = (current, type, originalElement) => {
        if (type === 'prev') return <button className="btn btn-sm btn-primary">Previous</button>;
        if (type === 'next') return <button className="btn btn-sm btn-primary">Next</button>;
        return originalElement;
    };

    const handleDeleteClick = (id) => {
        confirmAlert({
            title: "Confirm to delete",
            message: "Are you sure to do this.",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => dispatch(deleteRequirement(id)),
                },
                { label: "No" },
            ],
        });
    };

    const handleUpdateClick = (id) => {
        dispatch(getRequirementById(id));
        router.push(`/admin/updatebloodrequest/${id}`);
    };

    const handleViewClick = (donor) => {
        setSelectedDonor(donor);
        // open modal logic here (if required)
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Blood Group',
            dataIndex: 'blood_type',
            sorter: (a, b) => a.blood_type.length - b.blood_type.length,
        },
        {
            title: 'Phone Number',
            dataIndex: 'contact',
            sorter: (a, b) => a.contact.length - b.contact.length,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            sorter: (a, b) => a.location.length - b.location.length,
        },
        {
            title: 'Status',
            render: (record) => {
                if (record.isApproved === 1) return 'Approved';
                if (record.isApproved !== 1) return 'Unapproved';
                return 'Created';
            },
        },
        {
            title: 'Action',
            render: (text, record) => (
                <div className="d-flex justify-content-around">
                    {userInfo.roleName.includes(ROLES.Admin) && record.isApproved !== 1 && (
                        <button title="Approve" className="text-success" onClick={() => handleApproveClick(record.req_id)}>
                            <GiCheckMark />
                        </button>
                    )}
                    {userInfo.roleName.includes(ROLES.Admin) && record.isApproved === 1 && (
                        <button title="Disapprove" className="text-danger" onClick={() => handleDisApproveCLick(record.req_id)}>
                            <FcCancel />
                        </button>
                    )}
                    <button className="text-warning" onClick={() => handleUpdateClick(record.req_id)}>
                        <i className="fa fa-pencil m-r-5" />
                    </button>
                    <button title="View Profile" className="text-primary" onClick={() => handleViewClick(record)}>
                        <i className="fa fa-user"></i>
                    </button>
                    <button className="text-danger" onClick={() => handleDeleteClick(record.req_id)}>
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
                    <h1 className="h2">Blood Requirement Request List</h1>
                </div>
                <div className="col-auto">
                    <Link href="/admin/bloodrequirement/addbloodrequest" className="button-round border_radius">
                        <i className="fa fa-plus" aria-hidden="true" /> Add Request
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-2">
                    <select className="form-control" onChange={(e) => setState({ ...state, selectedBloodGroup: e.target.value })}>
                        {optionsBloodGroup.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
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
                            total: bloodRequirementCount,
                            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            showSizeChanger: true,
                            onShowSizeChange,
                            itemRender,
                            onChange: (page, pageSize) => setState({ ...state, page, pagesize: pageSize }),
                        }}
                        bordered
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        dataSource={bloodRequirementList}
                        rowKey={(record) => record.donorId}
                    />
                )}
            </div>

            {/* You can include modal logic here as needed */}
            {/* <DonorModalView isOpen={isDonorViewModalOpen} onClose={() => setDonorViewModalOpen(false)} donor={selectedDonor} /> */}
        </div>
    );
};

export default AllRequirementList