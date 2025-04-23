import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const personSlice = createSlice({
  name: "person",
  initialState: {
    skilledPersons: [],
    totalCount: null,
    isAdded: false,
    SkilledPerson: null,
    isLoading: false,
  },
  reducers: {
    getAllSkilledPersonsSuccess: (state, action) => {
      state.skilledPersons = action.payload.skilledPersons;
      state.totalCount = action.payload.pagination.total;
      state.isLoading = false;
    },
    getAllSkilledPersonsFailure: (state, action) => {
      state.skilledPersons = [];
      state.totalCount = null;
      state.isLoading = false;
    },
    addSkilledPersonSuccess: (state, action) => {
      state.isLoading = false;
    },
    addSkilledPersonFailure: (state, action) => {
      state.isLoading = false;
    },
    getSkilledPersonSuccess: (state, action) => {
      state.SkilledPerson = action.payload.data;
      state.isLoading = false;
    },
    getSkilledPersonFailure: (state, action) => {
      state.SkilledPerson = null;
      state.isLoading = false;
    },
    updateSkilledPersonSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateSkilledPersonFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteSkilledPersonSuccess: (state, action) => {
      // const personId = action.payload.id;
      // state.skilledPersons = state.skilledPersons.filter((SkilledPerson) => SkilledPerson.personId !== personId);
      state.isLoading = false;
    },
    deleteSkilledPersonFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getAllSkilledPersons = (search, page, pageSize, selectedVillage, isActive = false) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-skilledPersons`, {
      params: { page, pageSize, search, selectedVillage, isActive },
    });
    if (response.data.success) {
      dispatch(getAllSkilledPersonsSuccess(response.data.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getAllSkilledPersonsFailure());
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

    dispatch(getAllSkilledPersonsFailure());
  }
};

export const addSkilledPerson = (data, navigate, reset, setPreviewUrl) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-skilledperson`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.success) {
      reset();
      setPreviewUrl("");
      toast.success(response.data.message);
      dispatch(addSkilledPersonSuccess());
      navigate('/admin/all-SkilledPersons');
    }
    else {
      toast.error(response.data.message);
      dispatch(addSkilledPersonFailure());
    }
  } catch (error) {
    dispatch(addSkilledPersonFailure());
    toast.error(error.message);
  }
};
export const getSkilledPerson = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/skilledPerson/${id}`);
    if(response.data.success){
      dispatch(getSkilledPersonSuccess(response.data));
    }
   else{
    toast.error(response.data.message);
    dispatch(getSkilledPersonFailure());
   }
  } catch (error) {
    toast.error(error.message);
    dispatch(getSkilledPersonFailure());
  }
};

export const deleteSkilledPerson = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-skilledPerson/${id}`
    );
    if (response.data.success) {
      dispatch(deleteSkilledPersonSuccess());
      toast.success(response.data.message);
      dispatch(getAllSkilledPersons("", 1, 5, ""));
    }
    else {
      dispatch(deleteSkilledPersonFailure());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(deleteSkilledPersonFailure());
    toast.error(error.message);
  }
};

export const updateSkilledPerson = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-SkilledPerson/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      dispatch(updateSkilledPersonSuccess());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(updateSkilledPersonFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const {
  getAllSkilledPersonsSuccess,
  getAllSkilledPersonsFailure,
  addSkilledPersonSuccess,
  addSkilledPersonFailure,
  getSkilledPersonSuccess,
  getSkilledPersonFailure,
  updateSkilledPersonSuccess,
  updateSkilledPersonFailure,
  deleteSkilledPersonSuccess,
  deleteSkilledPersonFailure,
  setLoading,
} = personSlice.actions;
export default personSlice.reducer;
