import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const eventCategoryslice = createSlice({
    name: "eventCategory",
    initialState: {
        eventCategories: [],
        eventCategory: null,
        isLoading: false,
    },
    reducers: {
        getAllEventCategoriesSuccess: (state, action) => {
            state.eventCategories = action.payload.data;
            state.isLoading = false;
        },
        getAllEventCategoriesFailure: (state, action) => {
            state.eventCategories = [];
            state.isLoading = false;
        },
        setLoading: (state, action) => {
            state.isLoading = true;
        },
    },
});

export const getAllEventCategories = () => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get/allEventCategories`);
      if (response.status === 200) {
        dispatch(getAllEventCategoriesSuccess(response.data));
      } else {
        dispatch(getAllEventCategoriesFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(getAllEventCategoriesFailure());
    }
  };

export const {
    getAllEventCategoriesSuccess,
    getAllEventCategoriesFailure,
    setLoading,
} = eventCategoryslice.actions;
export default eventCategoryslice.reducer;
