import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedBackList: [],
    isLoading: false,
    feedBack: null,
    totalCount: 0
  },
  reducers: {
    getAllFeedBacksSuccess: (state, action) => {
      state.feedBackList = action.payload.data.feedbacks;
      state.totalCount = action.payload.totalCount;
      state.isLoading = false;
    },
    getAllFeedBacksFailure: (state, action) => {
      state.feedBackList = [];
      state.isLoading = false;
    },
    addFeedbackSuccess: (state, action) => {
      state.isLoading = false;
    },
    addFeedbackFailure: (state, action) => {
      state.isLoading = false;
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

export const getAllFeedbacks =
  (searchTerm, page, pageSize) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/all-feedbacks`,
        {
          params: {
            searchTerm,
            page,
            pageSize,
          },
        }
      );
      if (response.status === 200) {
        dispatch(getAllFeedBacksSuccess(response.data));
      } else {
        dispatch(getAllFeedBacksFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(getAllFeedBacksFailure());
    }
  };

export const addFeedback = (data, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/add-feedback`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      dispatch(addFeedbackSuccess(data));
      toast.success(response.data.message);
      navigate("/thankyou")
    }
  } catch (error) {
    dispatch(addFeedbackFailure());
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

// export const deleterequest = (id) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));
//     await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/delete-request/${id}`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     var searchTerm = "";
//     dispatch(deleterequestSuccess({ id }));
//     dispatch(getAllrequests(searchTerm, 1, 5));
//   } catch (error) {
//     dispatch(deleterequestFailure(error));
//   }
// };

export const {
  getAllFeedBacksSuccess,
  getAllFeedBacksFailure,
  addFeedbackSuccess,
  addFeedbackFailure,
  getrequestSuccess,
  getrequestFailure,
  updaterequestSuccess,
  updaterequestFailure,
  deleterequestSuccess,
  deleterequestFailure,
  setLoading,
  setHome,
} = feedbackSlice.actions;
export default feedbackSlice.reducer;
