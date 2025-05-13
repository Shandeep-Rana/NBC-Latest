'use client';

import axios from 'axios';

function getToken() {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
  }
  return '';
}

const get = (url) => {
  return new Promise((resolve, reject) => {
    const token = getToken();

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        maxRedirects: 0,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

const post = (url, params, opt = {}) => {
  const token = getToken();

  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}${url}`, params, {
        ...opt,
        headers: {
          ...opt.headers,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

const put = (url, params, opt = {}) => {
  const token = getToken();

  return new Promise((resolve, reject) => {
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}${url}`, params, {
        ...opt,
        headers: {
          ...opt.headers,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

const http = { get, post, put };

export default http;
