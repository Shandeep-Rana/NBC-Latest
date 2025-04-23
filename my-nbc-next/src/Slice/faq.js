import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ROLES } from "../constants/index";

const Faqslice = createSlice({
  name: "faq",
  initialState: {
    faqs: [],
    faq: null,
    isLoading: false,
  },
  reducers: {
    getFaqsSuccess: (state, action) => {
      state.faqs = action.payload.data;
      state.totalCount = action.payload.totalCount;
      state.isLoading = false;
    },
    getFaqsFailure: (state, action) => {
      state.faqs = [];
      state.isLoading = false;
    },
    addFaqsuccess: (state, action) => {
      state.faqs.push(action.payload);
      state.isLoading = false;
    },
    addFaqFailure: (state, action) => {
      state.isLoading = false;
    },
    getFaqsuccess: (state, action) => {
      state.faq = action.payload;
      state.isLoading = false;
    },
    getFaqFailure: (state, action) => {
      state.faq = null;
      state.isLoading = false;
    },
    updateFaqsuccess: (state, action) => {
      state.faqs = state.faqs.map((faq) =>
        faq.faqId === action.payload.faqId ? { ...faq, ...action.payload } : faq
      );
      state.isLoading = false;
    },
    updateFaqFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteFaqsuccess: (state, action) => {
      const faqId = action.payload.id;
      state.faqs = state.faqs.filter((faq) => faq.faqId !== faqId);
      state.isLoading = false;
    },
    deleteFaqFailure: (state, action) => {
      state.isLoading = false;
    },
    submitFaqQuestionSuccess: (state, action) => {
      state.isLoading = false;
    },
    submitFaqQuestionFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getAllFaqs = (searchTerm, page, pageSize) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/all-faqs`,
      {
        params: {
          searchTerm,
          page,
          pageSize,
        },
      }
    );
    if (response.status === 200) {
      dispatch(getFaqsSuccess(response.data));
    } else {
      dispatch(getFaqsFailure());
    }
  } catch (error) {
    console.log(error);
    dispatch(getFaqsFailure());
  }
};

export const addFaq = (data, navigate, reset, userInfo) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/add-question`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 && response.data.success) {
      toast.success(response.data.message);
      reset();
      dispatch(addFaqsuccess(response.data.data));
      if (userInfo?.roleName === ROLES.Admin) {
        navigate("/admin/faqs");
      }
    } else {
      toast.error(response.data.message || "Internal Server Error");
    }
  } catch (error) {
    dispatch(addFaqFailure());
    toast.error(error.message);
  }
};

export const getFaq = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/faq/${id}`
    );
    dispatch(getFaqsuccess(response.data));
  } catch (error) {
    dispatch(getFaqFailure(error));
  }
};

export const updateFaq = (id, data, navigate, reset) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/answer-faq/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 && response.data.success) {
      toast.success(response.data.message);
      dispatch(updateFaqsuccess(response.data.data));
      navigate("/admin/faqs");
    } else {
      toast.error(response.data.message);
      dispatch(updateFaqFailure());
    }
  } catch (error) {
    dispatch(updateFaqFailure());
    toast.error(error.message);
  }
};

export const deleteFaq = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-faq/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      var searchTerm = "";
      dispatch(deleteFaqsuccess({ id }));
      toast.success(response.data.message);
      dispatch(getAllFaqs(searchTerm, 1, 10));
    }
  } catch (error) {
    dispatch(deleteFaqFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const submitFaqQuestion = (data, reset) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-question`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 && response.data.success) {
      toast.success(response.data.message);
      reset();
      dispatch(submitFaqQuestionSuccess());
    } else {
      toast.error(response.data.message || "Internal Server Error");
      dispatch(submitFaqQuestionFailure());
    }
  } catch (error) {
    toast.error(error.message);
    dispatch(submitFaqQuestionFailure());
  }
};

export const {
  getFaqsSuccess,
  getFaqsFailure,
  addFaqsuccess,
  addFaqFailure,
  getFaqsuccess,
  getFaqFailure,
  updateFaqsuccess,
  updateFaqFailure,
  deleteFaqsuccess,
  deleteFaqFailure,
  submitFaqQuestionSuccess,
  submitFaqQuestionFailure,
  setLoading,
} = Faqslice.actions;
export default Faqslice.reducer;
