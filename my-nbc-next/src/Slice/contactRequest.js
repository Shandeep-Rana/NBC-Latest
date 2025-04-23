import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const requestSlice = createSlice({
  name: "contact",
  initialState: {
    requests: [],
    isLoading: false,
    isAdded: false,
    request: null,
    homeContactLoading: false
  },
  reducers: {
    getrequestsSuccess: (state, action) => {
      state.requests = action.payload.data;
      state.totalCount = action.payload.totalCount;
      state.isLoading = false;
    },
    getrequestsFailure: (state, action) => {
      state.requests = [];
      state.isLoading = false;
    },
    addrequestSuccess: (state, action) => {
      state.isLoading = false;
      state.homeContactLoading = false;
    },
    addrequestFailure: (state, action) => {
      state.isLoading = false;
      state.homeContactLoading = false;
    },
    getrequestSuccess: (state, action) => {
      state.request = action.payload;
      state.isLoading = false;
    },
    getrequestFailure: (state, action) => {
      state.request = null;
      state.isLoading = false;
    },
    updaterequestSuccess: (state, action) => {
      state.isLoading = false;
    },
    updaterequestFailure: (state, action) => {
      state.isLoading = false;
    },
    deleterequestSuccess: (state, action) => {
      const contactId = action.payload.id;
      state.requests = state.requests.filter(
        (request) => request.id !== contactId
      );
      state.isLoading = false;
    },
    deleterequestFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
    setHome: (state, action) => {
      state.homeContactLoading = true;
    }
  },
});

export const getAllrequests =
  (searchTerm, page, pageSize) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/all-contactRequests`,
        {
          params: {
            searchTerm,
            page,
            pageSize,
          },
        }
      );
      if (response.status === 200) {
        dispatch(getrequestsSuccess(response.data));
      } else {
        dispatch(getrequestsFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(getrequestsFailure());
    }
  };

export const addrequest = (data, reset, navigate) => async (dispatch) => {
  try {
    dispatch(setHome());
    dispatch(setLoading());
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/add-contact`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      reset();
      dispatch(addrequestSuccess(data));
      toast.success(response.data.message);
      navigate("/thankyou");
    }
  } catch (error) {
    dispatch(addrequestFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const getrequest = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request/${id}`);
    dispatch(getrequestSuccess(response.data));
  } catch (error) {
    dispatch(getrequestFailure(error));
  }
};

export const updaterequest = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/update-request/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch(updaterequestSuccess());
  } catch (error) {
    dispatch(updaterequestFailure(error));
  }
};

export const deleterequest = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/delete-request/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    var searchTerm = "";
    dispatch(deleterequestSuccess({ id }));
    dispatch(getAllrequests(searchTerm, 1, 5));
  } catch (error) {
    dispatch(deleterequestFailure(error));
  }
};

export const {
  getrequestsSuccess,
  getrequestsFailure,
  addrequestSuccess,
  addrequestFailure,
  getrequestSuccess,
  getrequestFailure,
  updaterequestSuccess,
  updaterequestFailure,
  deleterequestSuccess,
  deleterequestFailure,
  setLoading,
  setHome,
} = requestSlice.actions;
export default requestSlice.reducer;
