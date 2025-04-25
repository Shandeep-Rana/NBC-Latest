'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { Table } from 'antd';
import Link from 'next/link';
import { deleterequest, getAllrequests } from '@/Slice/contactRequest';
import Loader from '@/common/Loader';

const AllContactList = () => {
    const dispatch = useDispatch();
    const { requests, totalCount } = useSelector((state) => state.contact);

    const [state, setState] = useState({
        search: '',
        page: 1,
        pagesize: 5,
        selectedBloodGroup: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const reloadData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setLoading(false);
            dispatch(getAllrequests(state.search, state.page, state.pagesize));
        };
        reloadData();
    }, [state.search, state.page, state.pagesize, dispatch]);

    const handleDeleteClick = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => handleDelete(id),
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    const handleDelete = (id) => {
        dispatch(deleterequest(id));
    };

    const onShowSizeChange = (current, pageSize) => {
        setState((prev) => ({ ...prev, page: 1, pagesize: pageSize }));
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
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            sorter: (a, b) => a.subject.length - b.subject.length,
        },
        {
            title: 'Action',
            render: (text, record) => (
                <div className="d-flex justify-content-around">
                    <Link href="#" title="Delete" className="btn btn-link btn-xs">
                        <i
                            className="fa fa-trash"
                            style={{ color: 'red' }}
                            onClick={() => handleDeleteClick(record.contactId)}
                        ></i>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="container-fluid mt-2">
            <div className="row justify-content-between align-items-center all_donor_header mb-2">
                <div className="col-auto">
                    <h1 className="h2">Contact Requests</h1>
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
                {loading ? (
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
                        style={{ overflowX: 'auto' }}
                        columns={columns}
                        dataSource={requests}
                        rowKey={(record) => record.contactId}
                    />
                )}
            </div>
        </div>
    );
};

export default AllContactList;
