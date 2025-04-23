import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const socialMediaslice = createSlice({
  name: "socialMedia",
  initialState: {
    userlinks: null,
    isLoading: false,
  },
  reducers: {
    addLinksuccess: (state, action) => {
      state.isLoading = false;
    },
    addLinkFailure: (state, action) => {
      state.isLoading = false;
    },
    getUserLinkSuccess: (state, action) => {
      // debugger
      state.userlinks = action.payload;
      state.isLoading = false;
    },
    getUserLinkFailure: (state, action) => {
      state.userlinks = null;
      state.isLoading = false;
    },
    updateLinksuccess: (state, action) => {
      state.isLoading = false;
    },
    updateLinkFailure: (state, action) => {
      state.isLoading = false;
    },
    approveLinksuccess: (state, action) => {
      state.isLoading = false;
    },
    approveLinkFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteLinksuccess: (state, action) => {
      const accId = action.payload.id;
      state.userlinks = state.userlinks.filter((link) => link.id !== accId);
      state.isLoading = false;
    },
    deleteLinkFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getAllLinks =
  (searchTerm, page, pageSize) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-links`, {
        params: {
          searchTerm,
          page,
          pageSize,
        },
      });
      if (response.status === 200) {
        dispatch(getLinksSuccess(response.data));
      } else {
        dispatch(getLinksFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(getLinksFailure());
    }
  };

export const userLinks = (id) => async (dispatch) => {
  try {
    debugger
    dispatch(setLoading(true));
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user-links/${id}`, {
    });
    // debugger
    if (response.status === 200) {
      dispatch(getUserLinkSuccess(response.data));
    }
  } catch (error) {
    dispatch(getUserLinkFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const addLink = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/userlink/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      dispatch(addLinksuccess(data));
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(addLinkFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const getLink = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-links/${id}`);
    dispatch(getLinksuccess(response.data));
  } catch (error) {
    dispatch(getLinkFailure(error));
  }
};

export const updateLink = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-link/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      dispatch(updateLinksuccess());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(updateLinkFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const deleteLink = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-link/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      var searchTerm = "";
      dispatch(deleteLinksuccess({ id }));
      toast.success(response.data.message);
      dispatch(getAllLinks(searchTerm, 1, 10));
    }
  } catch (error) {
    dispatch(deleteLinkFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const {
  getLinksSuccess,
  getLinksFailure,
  getUserLinkSuccess,
  getUserLinkFailure,
  addLinksuccess,
  addLinkFailure,
  getLinksuccess,
  getLinkFailure,
  updateLinksuccess,
  updateLinkFailure,
  deleteLinksuccess,
  deleteLinkFailure,
  setLoading,
} = socialMediaslice.actions;
export default socialMediaslice.reducer;
