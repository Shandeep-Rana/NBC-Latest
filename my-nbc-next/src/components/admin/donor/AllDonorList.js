"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
// import DonorModalView from "./components/DonorModalView";
import { Table } from "antd";
import { deletedonor, getAllDonors, getdonor } from "@/Slice/bloodDonation";
import { BloodGroupOptions } from "@/constants";
import Loader from "@/common/Loader";

function AllDonorList() {
  const dispatch = useDispatch();

  const [selectedDonor, setSelectedDonor] = useState(null);
  const { totalCount, donors, isLoading } = useSelector((state) => state.donor);
  const [isDonorViewModalOpen, setDonorViewModalOpen] = useState(false);
  const [state, setState] = useState({
    search: "",
    page: 1,
    pagesize: 5,
    selectedBloodGroup: "",
  });

  useEffect(() => {
    dispatch(getAllDonors(state.search, state.page, state.pagesize, state.selectedBloodGroup));
  }, [dispatch, state.search, state.page, state.pagesize, state.selectedBloodGroup]);

  const optionsBloodGroup = useMemo(() => {
    return BloodGroupOptions?.map((option) => ({
      value: option.value,
      label: option.label,
    }));
  }, []);

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
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Blood Group",
      dataIndex: "bloodType",
      sorter: (a, b) => a.bloodType.length - b.bloodType.length,
    },
    {
      title: "Phone Number",
      dataIndex: "mobile",
      sorter: (a, b) => a.mobile.length - b.mobile.length,
    },
    {
      title: "Address",
      dataIndex: "village",
      sorter: (a, b) => a.village.length - b.village.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex justify-content-around">
          <Link
            href={`/admin/blooddonor/updatedonor/${record.donorId}`}
            className="dropdown-item px-2 text-warning"
            onClick={() => handleUpdateClick(record.donorId)}
          >
            <i className="fa fa-pencil m-r-5" />
          </Link>
          <button
            title="View Profile"
            className="dropdown-item px-2 text-primary"
            onClick={() => handleViewClick(record)}
          >
            <i className="fa fa-user" />
          </button>
          <button
            className="dropdown-item px-2 text-danger"
            onClick={() => handleDeleteClick(record.donorId)}
          >
            <i className="fa fa-trash m-r-5" />
          </button>
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
    dispatch(deletedonor(id));
  };

  const handleUpdateClick = (id) => {
    dispatch(getdonor(id));
  };

  const handleViewClick = (donor) => {
    setSelectedDonor(donor);
    setDonorViewModalOpen(true);
  };

  return (
    <div className="container-fluid mt-2">
      <div className="row justify-content-between align-items-center all_donor_header mb-2">
        <div className="col-auto">
          <h1 className="h2">Donor List</h1>
        </div>
        <div className="col-auto">
          <Link href="/admin/blooddonor/adddonor" className="button-round border_radius">
            <i className="fa fa-plus" aria-hidden="true"></i> Add Donor
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 col-lg-3 col-sm-3 mb-2 mb-lg-2">
          <select
            className="form-control"
            style={{ height: "2.4em" }}
            value={state.selectedBloodGroup}
            onChange={(e) => setState({ ...state, selectedBloodGroup: e.target.value })}
          >
            <option value="">Select Blood Group</option>
            {optionsBloodGroup?.map((option) => (
              <option key={option.value} value={option.value} disabled={option.isDisabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
            dataSource={donors}
            rowKey={(record) => record.donorId}
          />
        )}
      </div>
      {/* <DonorModalView
        isDonorViewModalOpen={isDonorViewModalOpen}
        toggleDonorViewModal={() => setDonorViewModalOpen(!isDonorViewModalOpen)}
        selectedDonor={selectedDonor}
      /> */}
    </div>
  );
}

export default AllDonorList;