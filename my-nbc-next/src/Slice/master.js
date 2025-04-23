import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RegisterRoles } from "../constants";
import { toast } from "react-hot-toast";

const masterSlice = createSlice({
  name: "masterSlice",
  initialState: {
    villages: [],
    interests: [],
    professions: [],
    categories:[],
    isLoading: false,
    registerRoleCheck: RegisterRoles.Donor,
    auditLogs: [],
    auditLogsCount: null,
    homeAllDonorsCount: null,
    homeAllMembersCount: null,
    homeAllVolunteersCount: null,
    homeAllEventsCount: null,
    homeAllHeroesCount: null,
  },
  reducers: {
    getAllVillagesSuccess: (state, action) => {
      state.villages = action.payload.data;
      state.isLoading = false;
    },
    getAllVillagesFailure: (state, action) => {
      state.villages = [];
      state.isLoading = false;
    },
    getAllCategoriesSuccess: (state, action) => {
      state.categories = action.payload.data;
      state.isLoading = false;
    },
    getAllCategoriesFailure: (state, action) => {
      state.categories = [];
      state.isLoading = false;
    },
    addVillageSuccess: (state, action) => {
      state.isLoading = false;
    },
    addVillageFailure: (state, action) => {
      state.isLoading = false;
    },
    addCategorySuccess: (state, action) => {
      state.isLoading = false;
    },
    addCategoryFailure: (state, action) => {
      state.isLoading = false;
    },
    addBothUserSuccess: (state, action) => {
      state.isLoading = false;
    },
    addBothUserFailure: (state, action) => {
      state.isLoading = false;
    },
    getAllIntrestsSuccess: (state, action) => {
      state.interests = action.payload.data;
      state.isLoading = false;
    },
    getAllIntrestsFailure: (state, action) => {
      state.interests = [];
      state.isLoading = false;
    },
    getAllProfessionsSuccess: (state, action) => {
      state.professions = action.payload.data;
      state.isLoading = false;
    },
    getAllProfessionsFailure: (state, action) => {
      state.professions = [];
      state.isLoading = false;
    },
    updateRegisterRoleDonor: (state, action) => {
      state.registerRoleCheck = RegisterRoles.Donor;
      state.isLoading = false;
    },
    makeRegisterRoleNull: (state, action) => {
      state.registerRoleCheck = null;
      state.isLoading = false;
    },
    updateRegisterRoleVolunteer: (state, action) => {
      state.registerRoleCheck = RegisterRoles.Volunteer;
      state.isLoading = false;
    },
    updateRegisterRoleBoth: (state, action) => {
      state.registerRoleCheck = RegisterRoles.Both;
      state.isLoading = false;
    },
    updateUserProfileSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateUserProfileFailure: (state, action) => {
      state.isLoading = false;
    },
    getAllAuditLogsSuccess: (state, action) => {
      state.auditLogs = action.payload.data.logs;
      state.auditLogsCount = action.payload.data.pagination.total;
      state.isLoading = false;
    },
    getAllAuditLogsFailure: (state, action) => {
      state.auditLogs = [];
      state.isLoading = false;
    },
    getCommunityStatsSuccess: (state, action) => {
      state.homeAllDonorsCount = action.payload.data.donorsCount;
      state.homeAllMembersCount = action.payload.data.MembersCount;
      state.homeAllVolunteersCount = action.payload.data.volunteersCount;
      state.homeAllEventsCount = action.payload.data.eventsCount;
      state.homeAllHeroesCount = action.payload.data.heroesCount;
      state.isLoading = false;
    },
    getCommunityStatsFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const addBothUser = (data, navigate, reset, setPreviewUrl) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-both`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      reset();
      setPreviewUrl("");
      dispatch(addBothUserSuccess(data));
      toast.success(response.data.message);
      navigate("/auth/login")
    }
  } catch (error) {
    dispatch(addBothUserFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const updateUserProfile = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-userProfile/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) {
      dispatch(updateUserProfileSuccess());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(updateUserProfileFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const getAllVillages = (searchTerm) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-villages`);
    if (response.data.success) {
      dispatch(getAllVillagesSuccess(response.data));
    }
    else {
      dispatch(getAllVillagesFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(getAllVillagesFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};

export const getAllCategories = (searchTerm) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-categories`);
    if (response.data.success) {
      dispatch(getAllCategoriesSuccess(response.data));
    }
    else {
      dispatch(getAllCategoriesFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(getAllCategoriesFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};

export const addCategory = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-category`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      dispatch(addCategorySuccess(response.data));
    }
  } catch (error) {
    dispatch(addCategoryFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
}

export const addVillage = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-village`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      dispatch(addVillageSuccess(response.data));
    }
  } catch (error) {
    dispatch(addVillageFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
}

export const getAllIntrests = (searchTerm) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-intrests`);
    if (response.data.success) {
      dispatch(getAllIntrestsSuccess(response.data));
    } else {
      dispatch(getAllIntrestsFailure());
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(getAllVillagesFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};

export const getAllProfessions = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-professions`);
    if (response.data.success) {
      dispatch(getAllProfessionsSuccess(response.data));
    } else {
      dispatch(getAllProfessionsFailure());
      toast.error(response.data.message)
    }
  } catch (error) {
    dispatch(getAllProfessionsFailure());
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)

  }
};

export const getAllAuditLogs = (page, pageSize, search, userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-auditlogs`, {
      params: {
        page,
        pageSize,
        search,
        userId
      },
    });
    if (response.data.success) {
      dispatch(getAllAuditLogsSuccess(response.data));
    } else {
      toast.error(response.data.message)
      dispatch(getAllAuditLogsFailure());
    }
  }
  catch (error) {
    toast.error(error.message)
    dispatch(getAllAuditLogsFailure());
  }
}

export const getCommunityStats = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-community-stats`);

    if (response.data.success) {
      dispatch(getCommunityStatsSuccess(response.data));
    } else {
      toast.error(response.data.message)
      dispatch(getCommunityStatsFailure());
    }
  }
  catch (error) {
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message)
    dispatch(getCommunityStatsFailure());
  }
}

export const {
  addBothUserSuccess,
  addBothUserFailure,
  getAllVillagesSuccess,
  getAllVillagesFailure,
  getAllCategoriesSuccess,
  getAllCategoriesFailure,
  addVillageFailure,
  addVillageSuccess,
  addCategoryFailure,
  addCategorySuccess,
  getAllIntrestsFailure,
  getAllIntrestsSuccess,
  getAllProfessionsSuccess,
  getAllProfessionsFailure,
  updateRegisterRoleVolunteer,
  updateRegisterRoleDonor,
  updateRegisterRoleBoth,
  updateUserProfileSuccess,
  updateUserProfileFailure,
  getAllAuditLogsSuccess,
  getAllAuditLogsFailure,
  getCommunityStatsSuccess,
  getCommunityStatsFailure,
  setLoading } =
  masterSlice.actions;
export default masterSlice.reducer;
