'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import { Table } from 'antd';
import { GiCheckMark } from 'react-icons/gi';
import { MdPublish } from 'react-icons/md';
import { FcCancel } from 'react-icons/fc';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { approveNews, deleteNews, disapproveNews, getPaginatedNews, publishNews } from '@/Slice/news';
import { getUserInfoFromToken, ROLES } from '@/constants';
import Loader from '@/common/Loader';

const AllNewsList = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const user = getUserInfoFromToken();
        setUserInfo(user);
    }, []);

    const { newsList, newsCount, isLoading } = useSelector((state) => state.news);

    const [state, setState] = useState({
        search: '',
        page: 1,
        pagesize: 5,
    });

    useEffect(() => {
        dispatch(getPaginatedNews(state.search, state.page, state.pagesize, userInfo?.userId));
    }, [dispatch, state.search, state.page, state.pagesize, userInfo?.userId]);

    const formatDate = (date) => moment(date).format('YYYY-MM-DD');

    const handleUpdateClick = (id) => {
        router.push(userInfo.roleName.includes(ROLES.Admin)
            ? `/admin/updatenews/${id}`
            : `/user/updatenews/${id}`);
    };

    const handleDelete = (id) => {
        dispatch(deleteNews(id, userInfo.userId));
    };

    const handleDeleteClick = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this?',
            buttons: [
                { label: 'Yes', onClick: () => handleDelete(id) },
                { label: 'No' },
            ],
        });
    };

    const handleApproveClick = (id) => {
        dispatch(approveNews({ newsId: id, userId: userInfo.userId }));
    };

    const handleDisapproveClick = (id) => {
        dispatch(disapproveNews({ newsId: id, userId: userInfo.userId }));
    };

    const handlePublishClick = (id) => {
        dispatch(publishNews({ newsId: id, userId: userInfo.userId }));
    };

    const onShowSizeChange = (current, pageSize) => {
        setState((prev) => ({ ...prev, page: 1, pagesize: pageSize }));
    };

    const itemRender = (current, type, originalElement) => {
        if (type === 'prev') return <button className="btn btn-sm btn-primary">Previous</button>;
        if (type === 'next') return <button className="btn btn-sm btn-primary">Next</button>;
        return originalElement;
    };

    const truncateWithEllipsis = (str, maxLength) =>
        str.length > maxLength ? str.slice(0, maxLength) + '...' : str;

    const columns = [
        {
            title: '#',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Title',
            render: (record) => truncateWithEllipsis(record.title, 33),
            sorter: (a, b) => a.title.length - b.title.length,
        },
        {
            title: 'Author Name',
            dataIndex: 'author_name',
            sorter: (a, b) => a.author_name.length - b.author_name.length,
        },
        {
            title: 'Publish Date',
            render: (record) => formatDate(record.publish_date),
            sorter: (a, b) => new Date(a.publish_date) - new Date(b.publish_date),
        },
        {
            title: 'Status',
            render: (record) => {
                if (record.is_delete_requested === 1) return 'Delete Requested';
                if (record.is_published === 1) return 'Published';
                if (record.is_approved === 1) return 'Approved';
                return 'Unapproved';
            },
        },
        {
            title: 'Action',
            render: (text, record) => (
                <div className="d-flex justify-content-around">
                    {userInfo.roleName.includes(ROLES.Admin) && record.is_approved !== 1 && (
                        <button title="Approve" className="px-2 text-success" onClick={() => handleApproveClick(record.news_id)}>
                            <GiCheckMark />
                        </button>
                    )}
                    {userInfo.roleName.includes(ROLES.Admin) && record.is_approved === 1 && (
                        <button title="Disapprove" className="px-2 text-danger" onClick={() => handleDisapproveClick(record.news_id)}>
                            <FcCancel />
                        </button>
                    )}
                    {userInfo.roleName.includes(ROLES.Admin) &&
                        formatDate(record.publish_date) > formatDate(new Date()) &&
                        record.is_published !== 1 && record.is_approved === 1 && (
                            <button title="Quick Publish" className="px-2" onClick={() => handlePublishClick(record.news_id)}>
                                <MdPublish />
                            </button>
                        )}
                    {(userInfo.roleName.includes(ROLES.Admin) || record.is_delete_requested !== 1) && (
                        <button className="px-2 text-warning" onClick={() => handleUpdateClick(record.news_id)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                    )}
                    {userInfo.roleName.includes(ROLES.Admin) && record.is_delete_requested !== 0 && (
                        <button title="Delete Requested" className="px-2 text-danger" onClick={() => handleDeleteClick(record.news_id)}>
                            <RiDeleteBin2Fill />
                        </button>
                    )}
                    {record.is_delete_requested !== 1 && (
                        <button title="Delete" className="px-2 text-danger" onClick={() => handleDeleteClick(record.news_id)}>
                            <i className="fa fa-trash" style={{ color: 'red' }}></i>
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="container-fluid mt-2">
            <div className="row justify-content-between align-items-center mb-2">
                <div className="col-auto">
                    <h1 className="h2">News</h1>
                </div>
                <div className="col-auto">
                    <button
                        onClick={() =>
                            router.push(userInfo.roleName.includes(ROLES.Admin) ? '/admin/addnews' : '/user/addnews')
                        }
                        className="button-round border_radius"
                    >
                        <i className="fa fa-plus" /> Add News
                    </button>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={state.search}
                        onChange={(e) => setState({ ...state, search: e.target.value })}
                    />
                </div>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <Table
                    pagination={{
                        current: state.page,
                        pageSize: state.pagesize,
                        total: newsCount,
                        showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange,
                        itemRender,
                        onChange: (page, pageSize) =>
                            setState((prev) => ({ ...prev, page, pagesize: pageSize })),
                    }}
                    bordered
                    columns={columns}
                    dataSource={newsList}
                    rowKey={(record) => record.news_id}
                />
            )}
        </div>
    );
};

export default AllNewsList;
