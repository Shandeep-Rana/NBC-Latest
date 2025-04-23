import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ROLES, commonPaginatedState } from "../constants/index";

const newsSlice = createSlice({
  name: "news",
  initialState: {
    newsList: [],
    newsCount: null,
    news: null,
    allComments: [],
    isLoading: false
  },
  reducers: {
    getPaginatedNewsSuccess: (state, action) => {
      state.newsList = action.payload.data.news;
      state.newsCount = action.payload.data.pagination.total;
      state.isLoading = false;
    },
    getPaginatedNewsFailure: (state, action) => {
      state.newsList = [];
      state.newsCount = null;
      state.isLoading = false;
    },
    addNewsSuccess: (state, action) => {
      state.newsList.push(action.payload.insertedNews);
      state.newsCount = state.newsCount + 1;
      state.isLoading = false;
    },
    addNewsFailure: (state, action) => {
      state.isLoading = false;
    },
    getNewsSuccess: (state, action) => {
      state.news = action.payload;
      state.isLoading = false;
    },
    getNewsFailure: (state) => {
      state.news = null;
      state.isLoading = false;
    },
    updateNewsSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateNewsFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteNewsSuccess: (state, action) => {
      const id = action.payload;
      state.newsList = state.newsList.filter((news) => news.news_id !== id);
      state.newsCount = state.newsCount - 1;
      state.isLoading = false;
    },
    deleteNewsFailure: (state, action) => {
      state.isLoading = false;
    },
    approveNewsSuccess: (state, action) => {
      state.isLoading = false;
    },
    approveNewsFailure: (state, action) => {
      state.isLoading = false;
    },
    disapproveNewsSuccess: (state, action) => {
      state.isLoading = false;
    },
    disapproveNewsFailure: (state, action) => {
      state.isLoading = false;
    },
    publishNewsSuccess: (state, action) => {
      state.isLoading = false;
    },
    publishNewsFailure: (state, action) => {
      state.isLoading = false;
    },
    UnpublishNewsSuccess: (state, action) => {
      state.isLoading = false;
    },
    UnpublishNewsFailure: (state, action) => {
      state.isLoading = false;
    },
    addCommentSuccess: (state, action) => {
      state.allComments.push(action.payload.addedComment);
      state.isLoading = false;
    },
    addCommentFailure: (state, action) => {
      state.isLoading = false;
    },
    getAllNewsCommentsSuccess: (state, action) => {
      state.allComments = action.payload.data.allComments;
      state.isLoading = false;
    },
    getAllNewsCommentsFailure: (state, action) => {
      state.allComments = [];
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getPaginatedNews = (search, page, pageSize, userId = null, isPublished = null, isApproved = null) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/paginated-news`, {
      params: {
        page,
        pageSize,
        search,
        userId,
        isPublished,
        isApproved,
      },
    });
    if (response.data.success) {
      dispatch(getPaginatedNewsSuccess(response.data));
    } else {
      dispatch(getPaginatedNewsFailure());
      toast.error(response.data.message)
    }
  } catch (error) {
    toast.error(error.message)
    dispatch(getPaginatedNewsFailure());
  }
};

export const addNews = (data, navigate, reset, userInfo, setThumbnailUrl) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-news`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.success) {
      toast.success(response.data.message);
      reset();
      setThumbnailUrl('');
      dispatch(addNewsSuccess(response.data.data));
      if (userInfo.roleName.includes(ROLES.Admin))
        navigate("/admin/news");
      else {
        navigate("/user/news");
      }
    }
    else {
      toast.error(response.data.message);
      dispatch(addNewsFailure());
    }
  } catch (error) {
    dispatch(addNewsFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const getNewsById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getNewsById/${id}`);
    if (response.data.success) {
      dispatch(getNewsSuccess(response.data.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getNewsFailure());
    }
  } catch (error) {
    toast.error(error.message);
    dispatch(getNewsFailure());
  }
};

export const getNewsByTitle = (title) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-news/${title}`);
    if (response.data.success) {
      dispatch(getNewsSuccess(response.data.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getNewsFailure());
    }
  } catch (error) {
    dispatch(getNewsFailure(error));
  }
};

export const updateNews = (id, userInfo, data, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/update-news/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "user-id": userInfo.userId,
        },
      }
    );
    if (response.data.success) {
      dispatch(updateNewsSuccess());
      toast.success(response.data.message);
      if (userInfo.roleName.includes(ROLES.Admin))
        navigate("/admin/news");
      else {
        navigate("/user/news");
      }
    }
    else {
      dispatch(updateNewsFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(updateNewsFailure());
    toast.error(error?.response?.data?.error || "Internal Server Error");
  }
};

export const deleteNews = (id, userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-news/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(deleteNewsSuccess(id));
    }
    else {
      toast.error(response.data.message);
      dispatch(deleteNewsFailure());
    }
  } catch (error) {
    dispatch(deleteNewsFailure());
    toast.error(error?.response?.data?.error || "Internal Server Error");
  }
};

export const approveNews= (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/approve-news`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(approveNewsSuccess());
      dispatch(getPaginatedNews(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(approveNewsFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(approveNewsFailure());
    toast.success(error.message);
  }
}

export const disapproveNews= (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/disapprove-news`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(disapproveNewsSuccess());
      dispatch(getPaginatedNews(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(disapproveNewsFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(disapproveNewsFailure());
    toast.success(error.message);
  }
}

export const publishNews = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/publish-news`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(publishNewsSuccess());
      dispatch(getPaginatedNews(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(publishNewsFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(publishNewsFailure());
    toast.success(error.message);
  }
}

export const UnpublishNews = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Unpublish-news`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(UnpublishNewsSuccess());
      dispatch(getPaginatedNews(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(UnpublishNewsFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(UnpublishNewsFailure());
    toast.success(error.message);
  }
}

export const addComment = (data, reset, setCommentParentId, setReplying) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-newscomment`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(addCommentSuccess(response.data.data));
      reset();
      if (data.parentId) {
        setCommentParentId(null);
        setReplying(false);
      }
      window.scroll(0, 0);
      toast.success(response.data.message);
    }
    else {
      dispatch(addCommentFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(addCommentFailure());
    toast.success(error.message);
  }
}

export const getAllNewsComments = (newsId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news-allcomments`,
      {
        params: {
          newsId
        },
      }
    );
    if (response.data.success) {
      dispatch(getAllNewsCommentsSuccess(response.data));
    }
    else {
      dispatch(getAllNewsCommentsFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(getAllNewsCommentsFailure());
    toast.error(error.message);
  }
}

export const {
  getPaginatedNewsSuccess,
  getPaginatedNewsFailure,
  addNewsSuccess,
  addNewsFailure,
  getNewsSuccess,
  getNewsFailure,
  updateNewsSuccess,
  updateNewsFailure,
  deleteNewsSuccess,
  deleteNewsFailure,
  approveNewsSuccess,
  approveNewsFailure,
  disapproveNewsSuccess,
  disapproveNewsFailure,
  publishNewsSuccess,
  publishNewsFailure,
  UnpublishNewsSuccess,
  UnpublishNewsFailure,
  addCommentSuccess,
  addCommentFailure,
  getAllNewsCommentsSuccess,
  getAllNewsCommentsFailure,
  setLoading,
} = newsSlice.actions;
export default newsSlice.reducer;
