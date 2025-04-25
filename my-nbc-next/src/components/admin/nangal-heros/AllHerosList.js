'use client';

import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import { getUserInfoFromToken } from '@/constants';
import { deleteHero, getPaginatedHeroes } from '@/Slice/heroSlice';
import Loader from '@/common/Loader';

const AllHerosList = () => {
  const dispatch = useDispatch();
  const userInfo = getUserInfoFromToken();
  const { allHeroes, heroesCount, isLoading } = useSelector((state) => state.hero);
  const [state, setState] = useState({
    search: "",
    page: 1,
    pagesize: 5,
  });

  useEffect(() => {
    dispatch(getPaginatedHeroes(state.search, state.page, state.pagesize));
  }, [dispatch, state.search, state.page, state.pagesize]);

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");

  const handleDelete = (id) => {
    dispatch(deleteHero(id, userInfo.userId));
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
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Achievement',
      dataIndex: 'recognition_title',
      render: (text) => text || "Null",
      sorter: (a, b) => {
        const titleA = a.recognition_title || '';
        const titleB = b.recognition_title || '';
        return titleA.length - titleB.length;
      },
    },
    {
      title: 'Date',
      render: (record) =>
        record.recognition_date ? formatDate(record.recognition_date) : "Null",
      sorter: (a, b) => {
        const dateA = a.recognition_date || '';
        const dateB = b.recognition_date || '';
        return dateA.length - dateB.length;
      },
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex justify-content-around">
          <Link
            href={`/admin/update-hero/${record.hero_id}`}
            className="dropdown-item px-2 text-warning"
          >
            <i className={`fa fa-pencil`}></i>
          </Link>
          <button
            title="Delete"
            className="dropdown-item px-2 text-danger"
            onClick={() => handleDeleteClick(record.hero_id)}
          >
            <i className={`fa fa-trash`} style={{ color: "red" }}></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid mt-2">
      <div className="row justify-content-between align-items-center all_donor_header mb-2">
        <div className="col-auto">
          <h1 className="h2">Our Heroes</h1>
        </div>
        <div className="col-auto">
          <Link
            href="/admin/add-hero"
            className={`button-round border_radius`}
          >
            <i className={`fa fa-plus`} aria-hidden="true"></i> Add Hero
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
              total: heroesCount,
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
            dataSource={allHeroes}
            rowKey={(record) => record.hero_id}
          />
        )}
      </div>
    </div>
  );
};

export default AllHerosList;
