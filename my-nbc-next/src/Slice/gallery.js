import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { commonPaginatedState } from "../constants";

const Imageslice = createSlice({
  name: "image",
  initialState: {
    galleryImages: [],
    galleryImagesCount: null,
    allImages: [],
    isLoading: false,
    galleryCategory: []
  },
  reducers: {
    getImagesuccess: (state, action) => {
      state.image = action.payload;
      state.isLoading = false;
    },
    getImageFailure: (state, action) => {
      state.image = null;
      state.isLoading = false;
    },
    updateImagesuccess: (state, action) => {
      state.isLoading = false;
    },
    updateImageFailure: (state, action) => {
      state.isLoading = false;
    },
    getAllImagesSuccess: (state, action) => {
      state.allImages = action.payload.data.images;
      state.galleryCategory = action.payload.data.categories;
      state.isLoading = false;
    },
    getAllImagesFailure: (state, action) => {
      state.allImages = [];
      state.isLoading = false;
    },
    addImagesuccess: (state, action) => {
      const updatedImages = [action.payload.insertedImage, ...state.galleryImages];
      state.galleryImages = updatedImages;
      state.galleryImagesCount = state.galleryImagesCount + 1;
      state.isLoading = false;
    },
    addImageFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteImagesuccess: (state, action) => {
      const imageIds = action.payload.ids;
      state.galleryImages = state.galleryImages.filter((image) => !imageIds.includes(image.image_id));
      state.galleryImagesCount = state.galleryImagesCount - imageIds.length;
      state.isLoading = false;
    },
    deleteImageFailure: (state, action) => {
      state.isLoading = false;
    },
    getPaginatedImagesSuccess: (state, action) => {
      state.galleryImages = action.payload.data.images;
      state.galleryImagesCount = action.payload.data.pagination.total;
      state.isLoading = false;
    },
    getPaginatedImagesFailure: (state, action) => {
      state.galleryImages = [];
      state.galleryImagesCount = null;
      state.isLoading = false;
    },
    approveImageSuccess: (state, action) => {
      state.isLoading = false;
    },
    approveImageFailure: (state, action) => {
      state.isLoading = false;
    },
    disApproveImageSuccess: (state, action) => {
      state.isLoading = false;
    },
    disApproveImageFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getPaginatedImages = (search, page, pageSize, userId = null) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/images`, {
      params: {
        page,
        pageSize,
        search,
        userId
      },
    });
    if (response.status === 200) {
      dispatch(getPaginatedImagesSuccess(response.data));
    } else {
      dispatch(getPaginatedImagesFailure());
    }
  } catch (error) {
    console.log(error);
    dispatch(getPaginatedImagesFailure());
  }
};

export const addImage = (data, fileInputRef) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-image`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200 && response.data.success) {
      dispatch(addImagesuccess(response.data.data));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success(response.data.message);
    }
    else {
      toast.error(response.data.message || "Internal Server Error");
      dispatch(addImageFailure());
    }
  } catch (error) {
    dispatch(addImageFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const deleteImage = (ids, userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-image/${ids}`,
      {
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
      }
    );
    if (response.data.success) {
      dispatch(deleteImagesuccess({ ids }));
      dispatch(getPaginatedImages(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, userId));
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(deleteImageFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const approveImage = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/approve-image`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(approveImageSuccess());
      dispatch(getPaginatedImages(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(approveImageFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(approveImageFailure());
    toast.success(error.message);
  }
}

export const disApproveImage = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/disapprove-image`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(disApproveImageSuccess());
      dispatch(getPaginatedImages(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize, data.userId));
      toast.success(response.data.message);
    }
    else {
      dispatch(disApproveImageFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(disApproveImageFailure());
    toast.success(error.message);
  }
}

export const getAllImages = (category_id = null) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/all-images`,
      {
        params: category_id ? { category_id } : {},
      }
    );

    if (response.data.success) {
      dispatch(getAllImagesSuccess(response.data));
    } else {
      toast.error(response.data.message);
      dispatch(getAllImagesFailure());
    }
  } catch (error) {
    toast.error(error.message);
    dispatch(getAllImagesFailure());
  }
};

export const getImage = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/image/${id}`);
    dispatch(getImagesuccess(response.data));
  } catch (error) {
    dispatch(getImageFailure(error));
  }
};

export const updateImage = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/answer-Image/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      dispatch(updateImagesuccess());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(updateImageFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const {
  getPaginatedImagesSuccess,
  getPaginatedImagesFailure,
  getAllImagesSuccess,
  getAllImagesFailure,
  addImagesuccess,
  addImageFailure,
  getImagesuccess,
  getImageFailure,
  updateImagesuccess,
  updateImageFailure,
  deleteImagesuccess,
  deleteImageFailure,
  approveImageSuccess,
  approveImageFailure,
  disApproveImageSuccess,
  disApproveImageFailure,
  setLoading,
} = Imageslice.actions;
export default Imageslice.reducer;
