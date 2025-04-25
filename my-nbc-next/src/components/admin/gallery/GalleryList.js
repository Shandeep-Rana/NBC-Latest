'use client';

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { confirmAlert } from "react-confirm-alert";
import { Table } from "antd";
import { BsHandThumbsUp } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { approveImage, deleteImage, disApproveImage, getPaginatedImages } from "@/Slice/gallery";
import { getUserInfoFromToken, ROLES } from "@/constants";
import Loader from "@/common/Loader";

const GalleryList = () => {
  const user = getUserInfoFromToken();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const { isLoading, galleryImages, galleryImagesCount } = useSelector((state) => state.image);

  const [state, setState] = useState({
    search: "",
    page: 1,
    pagesize: 10,
  });

  useEffect(() => {
    dispatch(getPaginatedImages(state.search, state.page, state.pagesize, user.userId));
  }, [dispatch, state.search, state.page, state.pagesize, user.userId]);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", file.name);
    formData.append("userId", user.userId);
    dispatch(addImage(formData, fileInputRef));
  };

  const handleMultipleDeleteClick = () => {
    if (selectedImageIds.length === 0) return;

    confirmAlert({
      title: "Confirm to delete",
      message: `Are you sure you want to delete ${selectedImageIds.length > 1 ? "these images" : "this image"}?`,
      buttons: [
        { label: "Yes", onClick: () => handleDelete(selectedImageIds) },
        { label: "No" },
      ],
    });
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this image?",
      buttons: [
        { label: "Yes", onClick: () => handleDelete([id]) },
        { label: "No" },
      ],
    });
  };

  const handleApproveClick = (id) => {
    dispatch(approveImage({ imageId: id, userId: user.userId }));
  };

  const handleDisApproveClick = (id) => {
    dispatch(disApproveImage({ imageId: id, userId: user.userId }));
  };

  const handleDelete = (ids) => {
    dispatch(deleteImage(ids, user.userId));
  };

  const rowSelection = {
    onChange: (selectedRowKeys) => setSelectedImageIds(selectedRowKeys),
  };

  const onShowSizeChange = (current, pageSize) => {
    setState((prevState) => ({ ...prevState, page: 1, pagesize: pageSize }));
  };

  const itemRender = (current, type, originalElement) => {
    if (type === "prev") return <button className="btn btn-sm btn-primary">Previous</button>;
    if (type === "next") return <button className="btn btn-sm btn-primary">Next</button>;
    return originalElement;
  };

  const truncateWithEllipsis = (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };

  const columns = [
    {
      title: "#",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      render: (text, record) => (
        <a href={record.image_url} target="_blank" rel="noreferrer">
          <img src={record.image_url} alt={record.title} style={{ width: "70px", height: "45px" }} />
        </a>
      ),
    },
    {
      title: "Image Name",
      render: (record) => truncateWithEllipsis(record.title, 33),
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Status",
      render: (record) => {
        if (record.is_delete_requested === 1) return "Delete Requested";
        if (record.is_approved === 1) return "Approved";
        return "Unapproved";
      },
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex justify-content-between">
          {user.roleName.includes(ROLES.Admin) && record.is_approved !== 1 && (
            <button className="btn btn-success px-2" onClick={() => handleApproveClick(record.image_id)}>
              <BsHandThumbsUp /> Approve
            </button>
          )}
          {user.roleName.includes(ROLES.Admin) && record.is_approved === 1 && (
            <button className="btn btn-warning px-2" onClick={() => handleDisApproveClick(record.image_id)}>
              <FcCancel /> Disapprove
            </button>
          )}
          {(record.is_delete_requested !== 1 || (user.roleName.includes(ROLES.Admin) && record.is_delete_requested !== 0)) && (
            <button className="btn btn-danger px-2" onClick={() => handleDeleteClick(record.image_id)}>
              {record.is_delete_requested !== 1 ? (
                <>
                  <i className="fa fa-trash" /> Delete
                </>
              ) : (
                <>
                  <RiDeleteBin2Fill /> Delete
                </>
              )}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid mt-2">
      <div className="row justify-content-between align-items-center all_donor_header mb-2">
        <div className="col-auto">
          <h1 className="h2">Gallery</h1>
        </div>
        <div className="col-auto">
          <label htmlFor="file_input" className="button-round border_radius" style={{ cursor: "pointer" }}>
            Add Image
          </label>
          <input
            style={{ display: "none" }}
            type="file"
            id="file_input"
            accept=".jpg,.png,.jpeg"
            name="image"
            ref={fileInputRef}
            onChange={handleAddImage}
          />
        </div>
      </div>

      <div className="row mb-2">
        <div className="col-md-3 col-lg-3 col-sm-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={state.search}
            onChange={(e) => setState({ ...state, search: e.target.value })}
          />
        </div>
        <div className="col-auto">
          <button
            className="button-round border_radius responsive_btn"
            style={{ height: 45 }}
            onClick={handleMultipleDeleteClick}
          >
            Delete Images
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <Table
          rowSelection={{ type: "checkbox", ...rowSelection }}
          pagination={{
            current: state.page,
            pageSize: state.pagesize,
            total: galleryImagesCount,
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            showSizeChanger: true,
            onShowSizeChange,
            itemRender,
            onChange: (page, pageSize) => setState({ ...state, page, pagesize: pageSize }),
          }}
          bordered
          style={{ overflowX: "auto" }}
          columns={columns}
          dataSource={galleryImages}
          rowKey={(record) => record.image_id}
        />
      )}
    </div>
  );
};

export default GalleryList;
