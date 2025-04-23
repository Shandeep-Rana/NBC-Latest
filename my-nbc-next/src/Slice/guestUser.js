import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const GuestUserSlice = createSlice({
  name: "GuestUser",
  initialState: {
    GuestUsers: [],
    GuestUser: null,
    isLoading: false,
    totalCount: null
  },
  reducers: {
    getAllGuestUsersSuccess: (state, action) => {
      state.GuestUsers = action.payload.guestUsers;
      state.totalCount = action.payload.pagination.total;
      state.isLoading = false;
    },
    getAllGuestUsersFailure: (state, action) => {
      state.GuestUsers = [];
      state.totalCount = null;
      state.isLoading = false;
    },
    addGuestUserSuccess: (state, action) => {
      state.isLoading = false;
    },
    addGuestUserFailure: (state, action) => {
      state.isLoading = false;
    },
    getGuestUserSuccess: (state, action) => {
      state.GuestUser = action.payload.data;
      state.isLoading = false;
    },
    getGuestUserFailure: (state, action) => {
      state.GuestUser = null;
      state.isLoading = false;
    },
    getGuestUserprofileSuccess: (state, action) => {
      state.GuestUser = action.payload;
      state.isLoading = false;
    },
    getGuestUserprofileFailure: (state, action) => {
      state.GuestUser = null;
      state.isLoading = false;
    },
    updateGuestUserSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateGuestUserFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteGuestUserSuccess: (state, action) => {
      const volunteerId = action.payload.id;
      state.GuestUsers = state.GuestUsers.filter((GuestUser) => GuestUser.volunteerId !== volunteerId);
      state.isLoading = false;
    },
    deleteGuestUserFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getAllGuestUsers = (search, page, pageSize) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/guest-users`, {
      params: { page, pageSize, search },
    });
    if (response.data.success) {
      dispatch(getAllGuestUsersSuccess(response.data.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getAllGuestUsersFailure());
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

    dispatch(getAllGuestUsersFailure());
  }
};

export const addGuestUser = (data, navigate, reset) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-volunteer`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      reset();
      dispatch(addGuestUserSuccess(data));
      toast.success(response.data.message);
      navigate("/admin/all-GuestUsers")
    }
  } catch (error) {
    dispatch(addGuestUserFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};
export const getGuestUser = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/guestUser/${id}`);
    dispatch(getGuestUserSuccess(response.data));
  } catch (error) {
    dispatch(getGuestUserFailure(error));
  }
};

export const getGuestUserprofile = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/GuestUser-profile/${email}`
    );
    dispatch(getGuestUserprofileSuccess(response.data));
  } catch (error) {
    dispatch(getGuestUserprofileFailure(error));
  }
};

export const updateGuestUser = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-guestUser/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      dispatch(updateGuestUserSuccess());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(updateGuestUserFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const deleteGuestUser = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-guestUser/${id}`
    );

    if (response.status === 200) {
      var searchTerm = "";
      dispatch(deleteGuestUserSuccess({ id }));
      toast.success(response.data.message);
      dispatch(getAllGuestUsers(searchTerm, 1, 10));
    }
  } catch (error) {
    dispatch(deleteGuestUserFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const {
  getAllGuestUsersSuccess, getAllGuestUsersFailure,

  addGuestUserSuccess,
  addGuestUserFailure,
  getGuestUserSuccess,
  getGuestUserFailure,
  getGuestUserprofileSuccess,
  getGuestUserprofileFailure,
  updateGuestUserSuccess,
  updateGuestUserFailure,
  deleteGuestUserSuccess,
  deleteGuestUserFailure,
  setLoading,
} = GuestUserSlice.actions;
export default GuestUserSlice.reducer;
