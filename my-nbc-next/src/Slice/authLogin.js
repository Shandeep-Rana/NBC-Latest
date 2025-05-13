import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ROLES, getUserInfoFromToken } from "../constants/index";
import { toast } from "react-hot-toast";
import http from "@/httpHandler/http";

const authLoginSlice = createSlice({
  name: "userLogin",
  initialState: {
    user: null,
    isLoading: false,
    error: "",
    isAuthenticated: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.data;
      state.isLoading = false;
      state.isAuthenticated = true;
    },
    loginFailure: (state) => {
      state.user = null;
      state.isLoading = false;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isLoading = false;
    },
    updatePasswordSuccess: (state) => {
      state.error = "";
      state.isLoading = false;
    },
    updatePasswordFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    forgotPasswordSuccess: (state) => {
      state.isLoading = false;
    },
    forgotPasswordFailure: (state) => {
      state.isLoading = false;
    },
    ResendVerifyOtpSuccess: (state) => {
      state.isLoading = false;
    },
    ResendVerifyOtpFailure: (state) => {
      state.isLoading = false;
    },
    resetPasswordSuccess: (state) => {
      state.isLoading = false;
    },
    resetPasswordFailure: (state) => {
      state.isLoading = false;
    },
    getUserSuccess: (state, action) => {
      state.user = action.payload.data;
      state.isLoading = false;
    },
    getUserFailure: (state, action) => {
      state.user = null;
      state.isLoading = false;
    },
    getUserByIdSuccess: (state, action) => {
      state.user = action.payload.data;
      state.isLoading = false;
    },
    getUserByIdFailure: (state, action) => {
      state.user = null;
      state.isLoading = false;
    },
    updateUserSuccess: (state, action) => {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.userProfile = action.payload.data;
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('storage'));
      }
      state.isLoading = false;
    },
    updateUserFailure: (state, action) => {
      state.isLoading = false;
    },
    updateUserPasswordSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateUserPasswordFailure: (state, action) => {
      state.isLoading = false;
    },
    updateAdminDetailsSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateAdminDetailsFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const loginUser = (data, router, reset) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event');
    const response = await http.post(`/loginUser`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {

      reset();

      dispatch(loginSuccess(response.data));
      const user = response.data.data;

      localStorage.setItem("user", JSON.stringify(user));
      toast.success(response.data.message);

      if (eventId) {
        router.push(`/event/participation/${eventId}`);
      } else if (user.roleName.includes(ROLES.Admin)) {
        router.push("/admin");
      } else if (user.roleName.includes(ROLES.Volunteer)) {
        router.push("/user");
      } else if (user.roleName.includes(ROLES.SkilledPerson)) {
        router.push("/user");
      }
    } else {
      toast.error(response.data.message);
      dispatch(loginFailure());
    }

  } catch (error) {
    dispatch(loginFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};

export const logoutUser = (router) => async (dispatch) => {
  try {
    dispatch(setLoading());
    localStorage.removeItem("user");
    dispatch(logoutSuccess());
    toast.success("Logged out successfully");
    router.push("/auth/signin");
  } catch (error) {
    toast.error("Logout failed");
  }
};


export const autologoutUser = (navigate) => async (dispatch) => {
  const userInfo = getUserInfoFromToken();
  const expirationTime = new Date(userInfo.expirationTime).getTime();
  const currentTime = new Date().getTime();
  const timeUntilExpiration = expirationTime - currentTime;

  if (timeUntilExpiration > 0) {
    setTimeout(() => {
      dispatch(logoutUser());
      navigate("/auth/login");
    }, timeUntilExpiration);
  }
};

export const forgotPassword = (data, reset, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/forget-password`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      reset();
      dispatch(forgotPasswordSuccess(response.data));
      navigate('/auth/login');
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
      dispatch(forgotPasswordFailure());
    }
  } catch (error) {
    dispatch(forgotPasswordFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};

export const otp = (data,) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/forget-password`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(forgotPasswordSuccess(response.data));
    } else {
      dispatch(forgotPasswordFailure());
    }
  } catch (error) {
    dispatch(forgotPasswordFailure());
  }
};


export const resendOtp = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/resendVerifyOtp`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(ResendVerifyOtpSuccess(response.data));
      toast.success(response.data.message);
    } else {
      dispatch(ResendVerifyOtpFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(ResendVerifyOtpFailure());
  }
};

export const getUserData = (email) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userbyemail/${email}`);
    dispatch(getUserSuccess(response.data));
  } catch (error) {
    dispatch(getUserFailure(error));
  }
};

export const getUserDataById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userbyid/${id}`);
    dispatch(getUserByIdSuccess(response.data));
  } catch (error) {
    dispatch(getUserByIdFailure(error));
  }
};

export const updateUser = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-user/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.success) {
      dispatch(updateUserSuccess(response.data));
      toast.success(response.data.message);
    }
    else {
      dispatch(updateUserFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(updateUserFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const updatePassword = (data, id, reset) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-Password/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      reset();
      dispatch(resetPasswordSuccess());
    }
    else {
      toast.error(response.data.message);
      dispatch(resetPasswordFailure());
    }
  } catch (error) {
    dispatch(resetPasswordFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};

export const resetPassword = (data, reset, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      dispatch(resetPasswordSuccess());
      reset();
      navigate('/auth/login');
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(resetPasswordFailure());
    const errorMessage = error?.response?.data?.error || 'Internal Server Error';
    toast.error(errorMessage);
  }
};

// export const updateProfilePicture = (data) => async (dispatch) => {
//   try {
//     dispatch(setLoading());
//     const response = await httpHandler.post('/api/user/updateProfilePicture', data);
//     if (response.data.success) {
//       toast.success(response.data.message);
//       dispatch(updateProfilePictureSuccess(response.data));
//     }
//   } catch (error) {
//   }
// }

export const updateAdminDetails = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-admindetails/${id}`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      toast.success(response.data.message);
      dispatch(updateAdminDetailsSuccess());
    }
    else {
      toast.error(response.data.error);
      dispatch(updateAdminDetailsFailure());
    }
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Internal Server Error');
    dispatch(updateAdminDetailsFailure());
  }
};

export const {
  loginSuccess,
  loginFailure,
  setLoading,
  logoutSuccess,
  updateUserSuccess,
  updateUserFailure,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  ResendVerifyOtpSuccess,
  ResendVerifyOtpFailure,
  updatePasswordSuccess,
  updatePasswordFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
  getUserSuccess,
  getUserFailure,
  getUserByIdSuccess,
  getUserByIdFailure,
  updateProfilePictureSuccess,
  updateUserPasswordFailure,
  updateUserPasswordSuccess,
  updateAdminDetailsSuccess,
  updateAdminDetailsFailure
} = authLoginSlice.actions;
export default authLoginSlice.reducer;
