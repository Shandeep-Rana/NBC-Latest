import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getUserInfoFromToken } from "../constants";

const PersonSpecializedSkillSlice = createSlice({
  name: "PersonSkills",
  initialState: {
    skills: [],
    personSpecializedSkills: [],
    personHavingSpecializedSkills: [],
    isLoading: false,
    isAdded: false,
    skill: null,
  },
  reducers: {
    getSkillsSuccess: (state, action) => {
      state.skills = action.payload.data;
      state.isLoading = false;
    },
    getSkillsFailure: (state, action) => {
      state.skills = [];
      state.isLoading = false;
    },
    addSkillSuccess: (state, action) => {
      state.isLoading = false;
    },
    addSkillFailure: (state, action) => {
      state.isLoading = false;
    },
    getPersonSkillsSuccess: (state, action) => {
      state.personSpecializedSkills = action.payload.data;
      state.isLoading = false;
    },
    getPersonSkillsFailure: (state, action) => {
      state.personSpecializedSkills = null;
      state.isLoading = false;
    },
    getPersonSkillSuccess: (state, action) => {
      state.skill = action.payload.data;
      state.isLoading = false;
    },
    getPersonSkillFailure: (state, action) => {
      state.skill = null;
      state.isLoading = false;
    },
    getpersonHavingSpecializedSkillsSuccess: (state, action) => {
      state.personHavingSpecializedSkills = action.payload.data.skills;
      state.isLoading = false;
    },
    getpersonHavingSpecializedSkillsFailure: (state, action) => {
      state.personHavingSpecializedSkills = null;
      state.isLoading = false;
    },
    updatePersonSkillSuccess: (state, action) => {
      state.isLoading = false;
    },
    updatePersonSkillFailure: (state, action) => {
      state.isLoading = false;
    },
    deletePersonSkillSuccess: (state, action) => {
      const SkillId = action.payload.id;
      state.personSpecializedSkills = state.personSpecializedSkills.filter(
        (skill) => skill.id !== SkillId
      );
      state.isLoading = false;
    },
    deletePersonSkillFailure: (state, action) => {
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

export const getAllPersonHavingSpecializedSkill = (search, page, pageSize, selectedSkill) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/getallpersonhavingskill`, {
      params: { page, pageSize, search, selectedSkill },
    });
    if (response.status === 200) {
      dispatch(getpersonHavingSpecializedSkillsSuccess(response.data));
    } else {
      dispatch(getpersonHavingSpecializedSkillsFailure());
    }
  } catch (error) {
    console.log(error);
    dispatch(getpersonHavingSpecializedSkillsFailure());
  }
};

export const addPersonSkill = (data, reset, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/addSkills`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      reset();
      dispatch(addSkillSuccess(data));
      toast.success(response.data.message);
      navigate("/member/my/specializedskill")
    }
  } catch (error) {
    dispatch(addSkillFailure());
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const getPersonSkills = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/getskillsofperson`, { userId: id });
    dispatch(getPersonSkillsSuccess(response.data));
  } catch (error) {
    dispatch(getPersonSkillsFailure(error));
  }
};

export const getPersonSkillbyid = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getpersonskillbyid/${id}`);
    dispatch(getPersonSkillSuccess(response.data));
  } catch (error) {
    dispatch(getPersonSkillFailure(error));
  }
};

export const updatePersonSkillById = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/updatepersonskillbyid/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch(updatePersonSkillSuccess());
    toast.success(response.data.message);
  } catch (error) {
    dispatch(updatePersonSkillFailure(error));
    toast.error(error?.response?.data?.error || "Internal Server Error");
  }
};

export const deletePersonSkill = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/deleteskillofperson`, { userId: id }
    );

    if (response.data.success) {
      dispatch(deletePersonSkillSuccess(id));
      const userInfo = getUserInfoFromToken();
      const personId = userInfo?.userId
      toast.success(response.data.message);
      dispatch(getPersonSkills(personId));
    } 
    else {
      dispatch(deletePersonSkillFailure());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(deletePersonSkillFailure(error));
  }
};

export const {
  getpersonHavingSpecializedSkillsSuccess,
  getpersonHavingSpecializedSkillsFailure,
  addSkillSuccess,
  addSkillFailure,
  getPersonSkillsSuccess,
  getPersonSkillsFailure,
  getPersonSkillSuccess,
  getPersonSkillFailure,
  updatePersonSkillSuccess,
  updatePersonSkillFailure,
  deletePersonSkillSuccess,
  deletePersonSkillFailure,
  setLoading,
  setHome,
} = PersonSpecializedSkillSlice.actions;
export default PersonSpecializedSkillSlice.reducer;
