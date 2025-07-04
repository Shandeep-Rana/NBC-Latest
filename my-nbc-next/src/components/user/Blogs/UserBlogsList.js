"use client"

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import { Table } from "antd";
import { approveBlog, deleteBlog, disApproveBlog, getPaginatedBlogs, publishBlog } from "../../Slice/blogs";
import Loader from "../../Components/Loader";
import { ROLES, getUserInfoFromToken } from "../../Components/constant/Constant";
import { GiCheckMark } from "react-icons/gi";
import { MdPublish } from "react-icons/md";
import { FcCancel } from "react-icons/fc";
import { RiDeleteBin2Fill } from "react-icons/ri";

const UserBlogsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = getUserInfoFromToken();
  const { blogsList, blogsCount, isLoading } = useSelector((state) => state.blog);
  const [state, setState] = useState({
    search: "",
    page: 1,
    pagesize: 5,
  });

  useEffect(() => {
    dispatch(getPaginatedBlogs(state.search, state.page, state.pagesize, userInfo.userId));
  }, [dispatch, state.search, state.page, state.pagesize, userInfo.userId]);

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");

  const handleUpdateClick = (id) => {
    navigate(userInfo.roleName.includes(ROLES.Admin) ? `/admin/update-blog/${id}` : `/user/update-blog/${id}`);
  };

  const handleDelete = (id) => {
    dispatch(deleteBlog(id, userInfo.userId));
  };

  const handleDeleteClick = (title) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(title),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleApproveClick = (id) => {
    const data = {
      blogId: id,
      userId: userInfo.userId
    }
    dispatch(approveBlog(data));
  }

  const handleDisApproveCLick = (id) => {
    const data = {
      blogId: id,
      userId: userInfo.userId
    }
    dispatch(disApproveBlog(data));
  }

  const handlePublishClick = (id) => {
    const data = {
      blogId: id,
      userId: userInfo.userId
    }
    dispatch(publishBlog(data));
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

  const truncateWithEllipsis = (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };

  const columns = [
    {
      title: '#',
      render: (text, record, index) => (
        index + 1
      )
    },
    {
      title: 'Title',
      render: (record) => (
        truncateWithEllipsis(record.title, 33)
      ),
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: 'Author Name',
      dataIndex: 'author_name',
      sorter: (a, b) => a.author.length - b.author.length,
    },
    {
      title: 'Publish Date',
      render: (record) => (
        formatDate(record.publish_date)
      ),
      sorter: (a, b) => a.publish_date.length - b.publish_date.length,
    },
    {
      title: 'Status',
      render: (record) => {
        if (record.is_delete_requested === 1) {
          return 'Delete Requested';
        }
        else if (record.is_published === 1) {
          return 'Published';
        } else if (record.is_published !== 1 && record.is_approved === 1) {
          return 'Approved';
        } else if (record.is_approved !== 1) {
          return 'Unapproved';
        } else {
          return 'Created';
        }
      },
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex justify-content-around" data-popper-placement="bottom-end">
          {userInfo.roleName.includes(ROLES.Admin) && record.is_approved !== 1 && (
            <Link to={"#"} title="Approve" className="dropdown-item px-2 text-success" onClick={() => handleApproveClick(record.blog_id)}>
              <GiCheckMark />
            </Link>
          )}
          {userInfo.roleName.includes(ROLES.Admin) && record.is_approved === 1 && (
            <Link to={"#"} title="DisApprove" className="dropdown-item px-2 text-success" onClick={() => handleDisApproveCLick(record.blog_id)}>
              <FcCancel />
            </Link>
          )}
          {
            userInfo.roleName.includes(ROLES.Admin) && formatDate(record.publish_date) > formatDate(new Date()) &&
            record.is_published !== 1 && record.is_approved === 1 &&
            <Link to={"#"} title="Quick Publish" className="dropdown-item px-2" onClick={() => handlePublishClick(record.blog_id)}>
              <MdPublish />
            </Link>
          }
          {(userInfo.roleName.includes(ROLES.Admin) || (!userInfo.roleName.includes(ROLES.Admin) && record.is_delete_requested !== 1)) && (
            <Link to={`#`} className="dropdown-item px-2 text-warning">
              <i
                className={`fa fa-pencil`}
                onClick={() => handleUpdateClick(record.blog_id)}
              ></i>
            </Link>
          )}
          {
            userInfo.roleName.includes(ROLES.Admin) && record.is_delete_requested !== 0 && (
              <Link to={"#"} title="Delete Requested" className="dropdown-item px-2 text-danger" onClick={() => handleDeleteClick(record.blog_id)}>
                <RiDeleteBin2Fill />
              </Link>
            )
          }
          {
            record.is_delete_requested !== 1 && (
              <Link to={"#"} title="Delete" className="dropdown-item px-2 text-danger">
                <i
                  className={`fa fa-trash`}
                  style={{ color: "red" }}
                  onClick={() => handleDeleteClick(record.blog_id)}
                ></i>
              </Link>
            )
          }
        </div>
      ),
    },
  ]

  return (
    <div className="container-fluid mt-2">
      <div className="row justify-content-between align-items-center all_donor_header mb-2">
        <div className="col-auto">
          <h1 className="h2">Blogs</h1>
        </div>
        <div className="col-auto">
          <Link to={userInfo.roleName.includes(ROLES.Admin) ? "/admin/add-blog" : "/user/add-blog"} className={`button-round border_radius`} type="button">
            <i className={`fa fa-plus`} aria-hidden="true"></i> Add Blog
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
              total: blogsCount,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
              showSizeChanger: true,
              onShowSizeChange: onShowSizeChange,
              itemRender: itemRender,
              onChange: (page, pageSize) =>
                setState({ ...state, page, pagesize: pageSize }),
            }}
            bordered
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={blogsList}
            rowKey={(record) => record.blog_id}
          />
        )}
      </div>
    </div>
  );
};

export default UserBlogsList;