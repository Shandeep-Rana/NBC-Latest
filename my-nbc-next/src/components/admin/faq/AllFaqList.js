"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
import { Table } from "antd";
import { confirmAlert } from "react-confirm-alert";
import Link from "next/link";
import { deleteFaq, getAllFaqs, getFaq } from "@/Slice/faq";
import Loader from "@/common/Loader";

const AllFaqList = () => {
    const dispatch = useDispatch();
    // const router = useRouter();

    const [state, setState] = useState({
        search: "",
        page: 1,
        pagesize: 5,
    });

    const { totalCount, faqs, isLoading } = useSelector((state) => state.faq);

    useEffect(() => {
        const reloadData = async () => {
            dispatch(getAllFaqs(state.search, state.page, state.pagesize));
        };
        reloadData();
    }, [dispatch, state.search, state.page, state.pagesize]);

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

    const handleUpdateClick = (id) => {
        dispatch(getFaq(id));
        // router.push(`/admin/update-faq/${id}`);
    };

    const handleDelete = (id) => {
        dispatch(deleteFaq(id));
    };

    const onShowSizeChange = (current, pageSize) => {
        setState({ ...state, page: 1, pagesize: pageSize });
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
            title: "Question",
            dataIndex: "question",
            sorter: (a, b) => a.question.length - b.question.length,
        },
        {
            title: "Action",
            render: (text, record) => (
                <div className="d-flex justify-content-around" data-popper-placement="bottom-end">
                    <Link href={`#`} passHref>
                        <div className={`btn btn-link btn-xs`} onClick={() => handleUpdateClick(record.faqId)}>
                            <i className={`fa fa-pencil`}></i>
                        </div>
                    </Link>
                    <Link href="#" passHref>
                        <div
                            title="Delete"
                            className={`btn btn-link btn-xs`}
                            onClick={() => handleDeleteClick(record.faqId)}
                        >
                            <i className={`fa fa-trash`} style={{ color: "red" }}></i>
                        </div>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="container-fluid mt-2">
            <div className="row justify-content-between align-items-center all_donor_header mb-2">
                <div className="col-auto">
                    <h1 className="h2">FAQs</h1>
                </div>
                <div className="col-auto">
                    <Link href="/admin/add-faq">
                        <div className={`button-round border_radius`} type="button">
                            <i className={`fa fa-plus`} aria-hidden="true"></i> Add FAQ
                        </div>
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
                        dataSource={faqs}
                        rowKey={(record) => record.faqId}
                    />
                )}
            </div>
        </div>
    );
};

export default AllFaqList;
