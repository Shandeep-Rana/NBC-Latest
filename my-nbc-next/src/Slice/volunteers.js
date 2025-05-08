import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const userSlice = createSlice({
  name: "user",
  initialState: {
    volunteers: [],
    users: [],
    user: null,
    isLoading: false,
    totalCount: null
  },
  reducers: {
    getAllVolunteersSuccess: (state, action) => {
      state.volunteers = action.payload.volunteers;
      state.totalCount = action.payload.pagination.total;
      state.isLoading = false;
    },
    getAllVolunteersFailure: (state, action) => {
      state.volunteers = [];
      state.totalCount = null;
      state.isLoading = false;
    },
    adduserSuccess: (state, action) => {
      state.isLoading = false;
    },
    adduserFailure: (state, action) => {
      state.isLoading = false;
    },
    getuserSuccess: (state, action) => {
      state.user = action.payload.data;
      state.isLoading = false;
    },
    getuserFailure: (state, action) => {
      state.user = null;
      state.isLoading = false;
    },
    getuserprofileSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    getuserprofileFailure: (state, action) => {
      state.user = null;
      state.isLoading = false;
    },
    updateuserSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateuserFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteuserSuccess: (state, action) => {
      const volunteerId = action.payload.id;
      state.users = state.users.filter((user) => user.volunteerId !== volunteerId);
      state.isLoading = false;
    },
    deleteuserFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getAllVolunteers = (search, page, pageSize, selectedVillage, isActive = false) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-volunteers`, {
      params: { page, pageSize, search, selectedVillage, isActive },
    });
    if (response.data.success) {
      dispatch(getAllVolunteersSuccess(response.data.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getAllVolunteersFailure());
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

    dispatch(getAllVolunteersFailure());
  }
};

export const adduser = (data, router, reset) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-volunteer`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      reset();
      dispatch(adduserSuccess(data));
      toast.success(response.data.message);
      router.push("/admin/all-volunteers")
    }
  } catch (error) {
    dispatch(adduserFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};
export const getuser = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/volunteer/${id}`);
    dispatch(getuserSuccess(response.data));
  } catch (error) {
    dispatch(getuserFailure(error));
  }
};

export const getuserprofile = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user-profile/${email}`
    );
    dispatch(getuserprofileSuccess(response.data));
  } catch (error) {
    dispatch(getuserprofileFailure(error));
  }
};

export const updateVolunteer = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-volunteer/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      dispatch(updateuserSuccess());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(updateuserFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const deleteVolunteer = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-volunteer/${id}`
    );

    if (response.status === 200) {
      var searchTerm = "";
      dispatch(deleteuserSuccess({ id }));
      toast.success(response.data.message);
      dispatch(getAllVolunteers(searchTerm, 1, 10));
    }
  } catch (error) {
    dispatch(deleteuserFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const {
  getAllVolunteersSuccess, getAllVolunteersFailure,

  adduserSuccess,
  adduserFailure,
  getuserSuccess,
  getuserFailure,
  getuserprofileSuccess,
  getuserprofileFailure,
  updateuserSuccess,
  updateuserFailure,
  deleteuserSuccess,
  deleteuserFailure,
  setLoading,
} = userSlice.actions;
export default userSlice.reducer;
