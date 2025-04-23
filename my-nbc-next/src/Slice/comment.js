import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const Commentslice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    isAdded: false,
    blogcomment: null,
    comment: null, 
    isLoading: false,
  },
  reducers: {
    getCommentsSuccess: (state, action) => {
      state.comments = action.payload.data;
      state.totalCount = action.payload.totalCount;
      state.isLoading = false;
    },
    getCommentsFailure: (state, action) => {
      state.comments = [];
      state.isLoading = false;
    },
    addCommentsuccess: (state, action) => {
      state.isLoading = false;
    },
    addCommentFailure: (state, action) => {
      state.isLoading = false;
    },
    getCommentSuccess: (state, action) => {
      state.comment = action.payload;
      state.isLoading = false;
    },
    getCommentFailure: (state, action) => {
      state.comment = null;
      state.isLoading = false;
    },
    getBlogCommentSuccess: (state, action) => {
      state.blogcomment = action.payload;
      state.isLoading = false;
    },
    getBlogCommentFailure: (state, action) => {
      state.blogcomment = null;
      state.isLoading = false;
    },
    updateCommentsuccess: (state, action) => {
      state.isLoading = false;
    },
    updateCommentFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteCommentsuccess: (state, action) => {
      const commentId = action.payload.id;
      state.comments = state.comments.filter((comment) => comment.id !== commentId);
      state.isLoading = false;
    },
    deleteCommentFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getAllComments =
  (searchTerm, page, pageSize) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        params: {
          searchTerm,
          page,
          pageSize, 
        },
      });
      if (response.status === 200) {
        dispatch(getCommentsSuccess(response.data));
      } else {
        dispatch(getCommentsFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(getCommentsFailure());
    }
  };

export const addComment = (data, reset) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-comment`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      reset();
      dispatch(addCommentsuccess(data));
      toast.success(response.data.message);
    //    navigate("/admin/all-Comments");
    }
  } catch (error) {
    dispatch(addCommentFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

 export const getBlogComments = (id) => async (dispatch) => {
   try {
     dispatch(setLoading(true));
     const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog-comment/${id}`);
     dispatch(getBlogCommentSuccess(response.data));
   } catch (error) {
     dispatch(getBlogCommentFailure(error));
   }
 };

 export const getComment = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comment/${id}`);
    dispatch(getCommentSuccess(response.data));
  } catch (error) {
    dispatch(getCommentFailure(error));
  }
};

export const updateComment = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-Comment/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) {
      dispatch(updateCommentsuccess());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(updateCommentFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

 export const deleteComment = (id) => async (dispatch) => {
   try {
     dispatch(setLoading(true));
     const response = await axios.delete(
       `${process.env.NEXT_PUBLIC_API_URL}/delete-Comment/${id}`,
       {
         headers: {
           "Content-Type": "application/json",
         },
       }
     );
     if (response.status === 200) {
       var searchTerm = "";
       dispatch(deleteCommentsuccess({ id }));
       toast.success(response.data.message);
       dispatch(getAllComments(searchTerm, 1, 10));
     }
   } catch (error) {
     dispatch(deleteCommentFailure(error));
     const errorMessage =
       error?.response?.data?.error || "Internal Server Error";
     toast.error(errorMessage);
   }
 };

export const {
  getCommentsSuccess,
  getCommentsFailure,
  getBlogCommentSuccess,
  getBlogCommentFailure,
  addCommentsuccess,
  addCommentFailure,
  getCommentSuccess,
  getCommentFailure,
  updateCommentsuccess,
  updateCommentFailure,
  deleteCommentsuccess,
  deleteCommentFailure,
  setLoading,
} = Commentslice.actions;
export default Commentslice.reducer;
