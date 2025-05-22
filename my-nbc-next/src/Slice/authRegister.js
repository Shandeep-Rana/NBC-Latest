import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const authRegisterSlice = createSlice({
  name: "userRegister",
  initialState: {
    isLoading: false,
  },
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
    registerAsVolunteerSuccess: (state, action) => {
      state.isLoading = false;
    },
    registerAsVolunteerFailure: (state, action) => {
      state.isLoading = false;
    },
    registerAsGuestUserSuccess: (state, action) => {
      state.isLoading = false;
    },
    registerAsGuestUserFailure: (state, action) => {
      state.isLoading = false;
    },
    registerAsDonorSuccess: (state, action) => {
      state.isLoading = false;
    },
    registerAsDonorFailure: (state, action) => {
      state.isLoading = false;
    },
    registerAsSkilledPersonSuccess: (state, action) => {
      state.isLoading = false;
    },
    registerAsSkilledPersonFailure: (state, action) => {
      state.isLoading = false;
    },
    registerAsBothSuccess: (state, action) => {
      state.isLoading = false;
    },
    registerAsBothFailure: (state, action) => {
      state.isLoading = false;
    },
    UpgradeVolunteerSuccess: (state, action) => {
      state.isLoading = false;
    },
    UpgradeVolunteerFailure: (state, action) => {
      state.isLoading = false;
    },
    UpgradeMemberSuccess: (state, action) => {
      state.isLoading = false;
    },
    UpgradeMemberFailure: (state, action) => {
      state.isLoading = false;
    },
    verifyOtpSuccess: (state, action) => {
      state.isLoading = false;
    },
    verifyOtpFailure: (state, action) => {
      state.isLoading = false;
    },
    UpgradeAsDonorToVolunteerSuccess: (state, action) => {
      state.isLoading = false;
    },
    UpgradeAsDonorToVolunteerFailure: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const registerAsVolunteer =
  (data, router, reset, setPreviewUrl) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-volunteer`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        reset();
        setPreviewUrl("");
        toast.success(response.data.message);
        dispatch(registerAsVolunteerSuccess());
        router.push("/auth/login");
      } else {
        dispatch(registerAsVolunteerFailure());
      }
    } catch (error) {
      dispatch(registerAsVolunteerFailure());
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message
      );
    }
  };

export const VerifyEmailForDonorToVolunteer = (data, toggalModel) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/verifyDonor`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(UpgradeAsDonorToVolunteerSuccess(response.data));
      toast.success(response.data.message);
      toggalModel();
    } else {
      toast.error(response.data.message);
      dispatch(UpgradeAsDonorToVolunteerFailure());
    }
  } catch (error) {
    dispatch(UpgradeAsDonorToVolunteerFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};


export const UpgradeToVolunteer = (data, toogleModal) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upgradeTovolunteer`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      dispatch(UpgradeVolunteerSuccess(data));
      toast.success(response.data.message);
      toogleModal();
    }
  } catch (error) {
    dispatch(UpgradeVolunteerFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const UpgradeToMember = (data, toogleModal) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upgradeToMember`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      dispatch(UpgradeMemberSuccess(data));
      toast.success(response.data.message);
      toogleModal();
    }
  } catch (error) {
    dispatch(UpgradeMemberFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const registerAsDonor =
  (data, router, reset, setPreviewUrl) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-donor`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        reset();
        setPreviewUrl("");
        toast.success(response.data.message);
        dispatch(registerAsDonorSuccess());
        router.push("/communitymembers/donors");
      } else {
        dispatch(registerAsDonorFailure());
      }
    } catch (error) {
      dispatch(registerAsDonorFailure());
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message
      );
    }
  };

export const registerAsSkilledPerson =
  (data,
     router, reset, 
    setPreviewUrl) => async (dispatch) => {
      try {
        dispatch(setLoading(true));
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/add-skilledperson`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          reset();
          setPreviewUrl("");
          toast.success(response.data.message);
          dispatch(registerAsSkilledPersonSuccess());
          router.push("/auth/signin");
        } else {
          dispatch(registerAsSkilledPersonFailure());
        }
      } catch (error) {
        dispatch(registerAsSkilledPersonFailure());
        toast.error(
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message
        );
      }
    };

export const registerAsGuestUser = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user-register`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(registerAsGuestUserSuccess());
    } else {
      dispatch(registerAsGuestUserFailure());
    }
  } catch (error) {
    dispatch(registerAsDonorFailure());
    toast.error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message
    );
  }
};

export const registerAsBoth =
  (data, navigate, reset, setPreviewUrl) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-both`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        reset();
        setPreviewUrl("");
        toast.success(response.data.message);
        dispatch(registerAsBothSuccess());
        navigate("/auth/login");
      } else {
        toast.error(response.data.message);
        dispatch(registerAsBothFailure());
      }
    } catch (error) {
      dispatch(registerAsBothFailure());
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message
      );
    }
  };

export const verifyOtp = (data, navigateCallback) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/verify-account`,
      data
    );
    if (response.status === 200) {
      dispatch(verifyOtpSuccess());
      toast.success(response.data.message);
      navigateCallback();
    } else {
      dispatch(verifyOtpFailure());
      toast.error(response.error);
    }
  } catch (error) {
    dispatch(verifyOtpFailure());
    toast.error(error.message);
  }
};

export const {
  registerAsVolunteerSuccess,
  registerAsVolunteerFailure,
  registerAsDonorSuccess,
  registerAsDonorFailure,
  registerAsSkilledPersonSuccess,
  registerAsSkilledPersonFailure,
  UpgradeVolunteerSuccess,
  UpgradeVolunteerFailure,
  UpgradeMemberSuccess,
  UpgradeMemberFailure,
  registerAsBothSuccess,
  registerAsBothFailure,
  verifyOtpSuccess,
  verifyOtpFailure,
  setLoading,
  registerAsGuestUserSuccess,
  registerAsGuestUserFailure,
  UpgradeAsDonorToVolunteerSuccess,
  UpgradeAsDonorToVolunteerFailure
} = authRegisterSlice.actions;
export default authRegisterSlice.reducer;
