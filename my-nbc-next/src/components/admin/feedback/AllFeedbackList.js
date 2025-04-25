"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "antd";
// import ViewFeedBackModel from "./ViewFeedBackModel";
import Link from "next/link";  
import { getAllFeedbacks } from "@/Slice/feedback";
import Loader from "@/common/Loader";

const AllFeedBackList = () => {
  const dispatch = useDispatch();
  const { feedBackList, totalCount, isLoading } = useSelector((state) => state.feedback);
  const [selectedFeedBack, setSelectedFeedBack] = useState(null);
  const [isFeedBackViewModalOpen, setFeedBackViewModalOpen] = useState(false);

  const [state, setState] = useState({
    search: "",
    page: 1,
    pagesize: 5,
  });

  useEffect(() => {
    dispatch(getAllFeedbacks(state.search, state.page, state.pagesize));
  }, [dispatch, state.search, state.page, state.pagesize]);

  const handleViewClick = (feedback) => {
    setSelectedFeedBack(feedback);
    setFeedBackViewModalOpen(true);
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
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Phone Number",
      dataIndex: "contact",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Feedback",
      dataIndex: "description",
      sorter: (a, b) => a.subject.length - b.subject.length,
    },
    {
      title: "Rating",
      dataIndex: "stars",
      sorter: (a, b) => a.subject.length - b.subject.length,
      render: (text) => `${text}/5`,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex justify-content-around" data-popper-placement="bottom-end">
          <Link href="#" passHref>
            <div className="dropdown-item px-2 text-primary" onClick={() => handleViewClick(record)}>
              <i className={`fa fa-eye`}></i>
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
          <h1 className="h2">FeedBack List</h1>
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
              showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
              showSizeChanger: true,
              onShowSizeChange: onShowSizeChange,
              itemRender: itemRender,
              onChange: (page, pageSize) => setState({ ...state, page, pagesize: pageSize }),
            }}
            bordered
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={feedBackList}
            rowKey={(record) => record.contactId}
          />
        )}
      </div>
      {/* <ViewFeedBackModel
        isFeedBackViewModalOpen={isFeedBackViewModalOpen}
        toggleFeedBackViewModal={() => setFeedBackViewModalOpen(!isFeedBackViewModalOpen)}
        selectedFeedBack={selectedFeedBack}
      /> */}
    </div>
  );
};

export default AllFeedBackList;
