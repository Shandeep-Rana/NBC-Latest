import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getUserInfoFromToken, ROLES, commonPaginatedState } from "../constants/index";

const bloodRequirementSlice = createSlice({
  name: "bloodRequirement",
  initialState: {
    bloodRequirementList: [],
    bloodRequirementCount: null,
    bloodRequirement: null,
    isLoading: false
  },
  reducers: {
    getAllRequestsSuccess: (state, action) => {
      state.bloodRequirementList = action.payload.data.requests;
      state.bloodRequirementCount = action.payload.data.pagination.total;
      state.isLoading = false;
    },
    getAllRequestsFailure: (state, action) => {
      state.bloodRequirementList = [];
      state.bloodRequirementCount = null;
      state.isLoading = false;
    },
    addBloodRequirementSuccess: (state, action) => {
      state.bloodRequirementList.push(action.payload.insertedRequirement);
      state.bloodRequirementCount = state.bloodRequirementCount + 1;
      state.isLoading = false;
    },
    addBloodRequirementFailure: (state, action) => {
      state.isLoading = false;
    },
    getRequirementSuccess: (state, action) => {
      state.bloodRequirement = action.payload;
      state.isLoading = false;
    },
    getRequirementFailure: (state) => {
      state.bloodRequirement = null;
      state.isLoading = false;
    },
    updateRequirementSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateRequirementFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteRequirementSuccess: (state, action) => {
      const id = action.payload;
      state.bloodRequirementList = state.bloodRequirementList.filter((req) => req.req_id !== id);
      state.bloodRequirementCount = state.bloodRequirementCount - 1;
      state.isLoading = false;
    },
    deleteRequirementFailure: (state, action) => {
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

export const getPaginatedRequests = (search, page, pageSize, selectedBloodGroup) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-requirements`, {
      params: {
        page,
        pageSize,
        search,
        selectedBloodGroup
      },
    });
    if (response.data.success) {
      dispatch(getAllRequestsSuccess(response.data));
    } else {
      dispatch(getAllRequestsFailure());
      toast.error(response.data.message)
    }
  } catch (error) {
    toast.error(error.message)
    dispatch(getAllRequestsFailure());
  }
};

export const addRequirement = (data, reset, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-requirement`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      reset();
      dispatch(addBloodRequirementSuccess)
      toast.success(response.data.message);
      router.push('')
    }
    else {
      toast.error(response.data.message);
      dispatch(addBloodRequirementFailure());
    }
  } catch (error) {
    dispatch(addBloodRequirementFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const getRequirementById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-requirement/${id}`);
    if (response.data.success) {
      dispatch(getRequirementSuccess(response.data.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getRequirementFailure());
    }
  } catch (error) {
    toast.error(error.message);
    dispatch(getRequirementFailure());
  }
};


export const updateRequirement = (id, data, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/update-requirement/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      var userInfo = getUserInfoFromToken();
      if (userInfo !== null && userInfo.roleName?.includes(ROLES.Admin)) {
        navigate(`/admin/allbloodrequest`);
      }
      dispatch(updateRequirementSuccess());
      toast.success(response.data.message);
    }
    else {
      dispatch(updateRequirementFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(updateRequirementFailure());
    toast.error(error?.response?.data?.error || "Internal Server Error");
  }
};

export const deleteRequirement = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-requirement/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(deleteRequirementSuccess(id));
    }
    else {
      toast.error(response.data.message);
      dispatch(deleteRequirementFailure());
    }
  } catch (error) {
    dispatch(deleteRequirementFailure());
    toast.error(error?.response?.data?.error || "Internal Server Error");
  }
};

export const approveBloodRequirement = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/approve-requirement`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(approveBlogSuccess());
      dispatch(getPaginatedRequests(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize));
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

export const disApproveBloodRequirement= (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/disapprove-requirement`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(disApproveBlogSuccess());
      dispatch(getPaginatedRequests(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize));
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

export const {
  getAllRequestsSuccess,
  getAllRequestsFailure,
  addBloodRequirementSuccess,
  addBloodRequirementFailure,
  getRequirementSuccess,
  getRequirementFailure,
  updateRequirementSuccess,
  updateRequirementFailure,
  deleteRequirementSuccess,
  deleteRequirementFailure,
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
} = bloodRequirementSlice.actions;
export default bloodRequirementSlice.reducer;
