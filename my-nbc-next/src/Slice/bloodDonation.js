import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const donorSlice = createSlice({
  name: "donor",
  initialState: {
    donors: [],
    totalCount: null,
    isAdded: false,
    donor: null,
    isLoading: false,
  },
  reducers: {
    getAllDonorsSuccess: (state, action) => {
      state.donors = action.payload.donors;
      state.totalCount = action.payload.pagination.total;
      state.isLoading = false;
    },
    getAllDonorsFailure: (state, action) => {
      state.donors = [];
      state.totalCount = null;
      state.isLoading = false;
    },
    addDonorSuccess: (state, action) => {
      state.isLoading = false;
    },
    addDonorFailure: (state, action) => {
      state.isLoading = false;
    },
    UpgradeDonorSuccess: (state, action) => {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.roleName = action.payload.roleNames;
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('storage'));
      }
      state.isLoading = false;
    },
    UpgradeDonorFailure: (state, action) => {
      state.isLoading = false;
    },
    getdonorSuccess: (state, action) => {
      state.donor = action.payload.data;
      state.isLoading = false;
    },
    getdonorFailure: (state, action) => {
      state.donor = null;
      state.isLoading = false;
    },
    updatedonorSuccess: (state, action) => {
      state.isLoading = false;
    },
    updatedonorFailure: (state, action) => {
      state.isLoading = false;
    },
    deletedonorSuccess: (state, action) => {
      // const donorId = action.payload.id;
      // state.donors = state.donors.filter((donor) => donor.id !== donorId);
      state.isLoading = false;
    },
    deletedonorFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getAllDonors = (search, page, pageSize, selectedBloodGroup) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-donors`, {
      params: {
        page,
        pageSize,
        search,
        selectedBloodGroup,
      },
    });
    if (response.data.success) {
      dispatch(getAllDonorsSuccess(response.data.data));
    } else {
      toast.error(response.data.message);
      dispatch(getAllDonorsFailure());
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)
    dispatch(getAllDonorsFailure());
  }
};

export const addDonor = (data, router, reset, setPreviewUrl) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-donor`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.success) {
      reset();
      setPreviewUrl("");
      toast.success(response.data.message);
      dispatch(addDonorSuccess(data));
      router.push('/admin/all-donors');
    }
    else {
      dispatch(addDonorFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(addDonorFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};

export const upgradeDonor = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upgradeTodonor`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(UpgradeDonorSuccess(response.data));
      // navigate('/admin/all-donors');
    }
    else {
      dispatch(UpgradeDonorFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(UpgradeDonorFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};

export const getdonor = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/donor/${id}`);
    if(response.data.success){
      dispatch(getdonorSuccess(response.data));
    }
    else{
      toast.error(response.data.message);
      dispatch(getdonorFailure());
    }
  } catch (error) {
    toast.error(error.message);
    dispatch(getdonorFailure());
  }
};

export const updatedonor = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-Donor/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      dispatch(updatedonorSuccess());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(updatedonorFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const deletedonor = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-donor/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(deletedonorSuccess());
      toast.success(response.data.message);
      dispatch(getAllDonors("", 1, 5, ""));
    }
    else {
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(deletedonorFailure(error));
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)
  }
};

export const {
  getAllDonorsSuccess,
  getAllDonorsFailure,
  addDonorSuccess,
  addDonorFailure,
  UpgradeDonorSuccess,
  UpgradeDonorFailure,
  getdonorSuccess,
  getdonorFailure,
  updatedonorSuccess,
  updatedonorFailure,
  deletedonorSuccess,
  deletedonorFailure,
  setLoading,
} = donorSlice.actions;
export default donorSlice.reducer;
