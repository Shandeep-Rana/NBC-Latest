import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ROLES, commonPaginatedState } from "../constants/index";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogsList: [],
    blogsCount: null,
    blog: null,
    allComments: [],
    isLoading: false
  },
  reducers: {
    getPaginatedBlogsSuccess: (state, action) => {
      state.blogsList = action.payload.data.blogs;
      state.blogsCount = action.payload.data.pagination.total;
      state.isLoading = false;
    },
    getPaginatedBlogsFailure: (state, action) => {
      state.blogsList = [];
      state.blogsCount = null;
      state.isLoading = false;
    },
    addBlogSuccess: (state, action) => {
      state.blogsList.push(action.payload.insertedBlog);
      state.blogsCount = state.blogsCount + 1;
      state.isLoading = false;
    },
    addBlogFailure: (state, action) => {
      state.isLoading = false;
    },
    getBlogSuccess: (state, action) => {
      state.blog = action.payload;
      state.isLoading = false;
    },
    getBlogFailure: (state) => {
      state.blog = null;
      state.isLoading = false;
    },
    updateBlogSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateBlogFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteBlogSuccess: (state, action) => {
      const id = action.payload;
      state.blogsList = state.blogsList.filter((blog) => blog.blog_id !== id);
      state.blogsCount = state.blogsCount - 1;
      state.isLoading = false;
    },
    deleteBlogFailure: (state, action) => {
      state.isLoading = false;
    },
    approveBlogSuccess: (state, action) => {
      state.isLoading = false;
    },
    approveBlogFailure: (state, action) => {
      state.isLoading = false;
    },
    disApproveBlogSuccess: (state, action) => {
      state.isLoading = false;
    },
    disApproveBlogFailure: (state, action) => {
      state.isLoading = false;
    },
    publishBlogSuccess: (state, action) => {
      state.isLoading = false;
    },
    publishBlogFailure: (state, action) => {
      state.isLoading = false;
    },
    UnpublishBlogSuccess: (state, action) => {
      state.isLoading = false;
    },
    UnpublishBlogFailure: (state, action) => {
      state.isLoading = false;
    },
    addCommentSuccess: (state, action) => {
      state.allComments.push(action.payload.addedComment);
      state.isLoading = false;
    },
    addCommentFailure: (state, action) => {
      state.isLoading = false;
    },
    getAllBlogCommentsSuccess: (state, action) => {
      state.allComments = action.payload.data.allComments;
      state.isLoading = false;
    },
    getAllBlogCommentsFailure: (state, action) => {
      state.allComments = [];
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getPaginatedBlogs = (search, page, pageSize, userId = null, isPublished = null, isApproved = null) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/paginated-blogs`, {
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
      dispatch(getPaginatedBlogsSuccess(response.data));
    } else {
      dispatch(getPaginatedBlogsFailure());
      toast.error(response.data.message)
    }
  } catch (error) {
    toast.error(error.message)
    dispatch(getPaginatedBlogsFailure());
  }
};

export const addBlog = (data, navigate, reset, userInfo, setThumbnailUrl) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-blog`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.success) {
      toast.success(response.data.message);
      reset();
      setThumbnailUrl('');
      dispatch(addBlogSuccess(response.data.data));
      if (userInfo.roleName.includes(ROLES.Admin))
        navigate("/admin/all-blogs");
      else {
        navigate("/user/blogs");
      }
    }
    else {
      toast.error(response.data.message);
      dispatch(addBlogFailure());
    }
  } catch (error) {
    dispatch(addBlogFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const getBlogById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getBlogById/${id}`);
    if (response.data.success) {
      dispatch(getBlogSuccess(response.data.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getBlogFailure());
    }
  } catch (error) {
    toast.error(error.message);
    dispatch(getBlogFailure());
  }
};

export const getBlogByTitle = (title) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-blog/${title}`);
    if (response.data.success) {
      dispatch(getBlogSuccess(response.data.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getBlogFailure());
    }
  } catch (error) {
    dispatch(getBlogFailure(error));
  }
};

export const updateBlog = (id, userInfo, data, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/update-blog/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "user-id": userInfo.userId,
        },
      }
    );
    if (response.data.success) {
      dispatch(updateBlogSuccess());
      toast.success(response.data.message);
      if (userInfo.roleName.includes(ROLES.Admin))
        navigate("/admin/all-blogs");
      else {
        navigate("/user/blogs");
      }
    }
    else {
      dispatch(updateBlogFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(updateBlogFailure());
    toast.error(error?.response?.data?.error || "Internal Server Error");
  }
};

export const deleteBlog = (id, userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-blog/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(deleteBlogSuccess(id));
    }
    else {
      toast.error(response.data.message);
      dispatch(deleteBlogFailure());
    }
  } catch (error) {
    dispatch(deleteBlogFailure());
    toast.error(error?.response?.data?.error || "Internal Server Error");
  }
};

export const approveBlog = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/approve-blog`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(approveBlogSuccess());
      dispatch(getPaginatedBlogs(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(approveBlogFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(approveBlogFailure());
    toast.success(error.message);
  }
}

export const disApproveBlog = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/disapprove-blog`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(disApproveBlogSuccess());
      dispatch(getPaginatedBlogs(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(disApproveBlogFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(disApproveBlogFailure());
    toast.success(error.message);
  }
}

export const publishBlog = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/publish-blog`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(publishBlogSuccess());
      dispatch(getPaginatedBlogs(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(publishBlogFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(publishBlogFailure());
    toast.success(error.message);
  }
}

export const UnpublishBlog = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Unpublish-blog`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(UnpublishBlogSuccess());
      dispatch(getPaginatedBlogs(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(UnpublishBlogFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(UnpublishBlogFailure());
    toast.success(error.message);
  }
}

export const addComment = (data, reset, setCommentParentId, setReplying) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-blogcomment`, data,
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

export const getAllBlogComments = (blogId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog-allcomments`,
      {
        params: {
          blogId
        },
      }
    );
    if (response.data.success) {
      dispatch(getAllBlogCommentsSuccess(response.data));
    }
    else {
      dispatch(getAllBlogCommentsFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(getAllBlogCommentsFailure());
    toast.error(error.message);
  }
}

export const {
  getPaginatedBlogsSuccess,
  getPaginatedBlogsFailure,
  addBlogSuccess,
  addBlogFailure,
  getBlogSuccess,
  getBlogFailure,
  updateBlogSuccess,
  updateBlogFailure,
  deleteBlogSuccess,
  deleteBlogFailure,
  approveBlogSuccess,
  approveBlogFailure,
  disApproveBlogSuccess,
  disApproveBlogFailure,
  publishBlogSuccess,
  publishBlogFailure,
  UnpublishBlogSuccess,
  UnpublishBlogFailure,
  addCommentSuccess,
  addCommentFailure,
  getAllBlogCommentsSuccess,
  getAllBlogCommentsFailure,
  setLoading,
} = blogSlice.actions;
export default blogSlice.reducer;
