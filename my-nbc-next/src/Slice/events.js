import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ROLES, getUserInfoFromToken, commonPaginatedState } from "../constants/index";

const eventslice = createSlice({
  name: "event",
  initialState: {
    events: [],
    eventRequests: [],
    userEvent: [],
    isAdded: false,
    event: null,
    isLoading: false,
    totalCount: 0,
    clientAllEvents: [],
    hasMore: false,
    eventParticipants: [],
    eventParticipantsWithoutPagination: [],
    eventParticipant:  null,
    eventsWithoutPagination: [],
    userCertificates: []
  },
  reducers: {
    getEventsSuccess: (state, action) => {
      state.events = action.payload.data;
      state.totalCount = action.payload.totalCount;
      state.isLoading = false;
    },
    getEventsFailure: (state, action) => {
      state.events = [];
      state.isLoading = false;
    },
    getALLEventsSuccess: (state, action) => {
      state.eventsWithoutPagination = action.payload.data.eventsWithImageUrl;
      state.isLoading = false;
    },
    getALLEventsFailure: (state, action) => {
      state.eventsWithoutPagination = [];
      state.isLoading = false;
    },
    getEventParticipantsSuccess: (state, action) => {
      state.eventParticipants = action.payload.data.participants;
      state.totalCount = action.payload.pagination;
      state.isLoading = false;
    },
    getEventParticipantsFailure: (state, action) => {
      state.eventParticipants = [];
      state.isLoading = false;
    },
    getEventParticipantsWithoutPaginationSuccess: (state, action) => {
      state.eventParticipantsWithoutPagination = action.payload.data.participants;
      state.totalCount = action.payload.pagination;
      state.isLoading = false;
    },
    getEventParticipantsWithoutPaginationFailure: (state, action) => {
      state.eventParticipantsWithoutPagination = [];
      state.isLoading = false;
    },
    getUserEventsSuccess: (state, action) => {
      state.userEvent = action.payload
      // state.totalCount = action.payload.totalCount;
      state.isLoading = false;
    },
    getUserEventsFailure: (state, action) => {
      state.userEvent = [];
      state.isLoading = false;
    },
    getEventsRequestSuccess: (state, action) => {
      state.eventRequests = action.payload.data;
      state.totalCount = action.payload.totalCount;
      state.isLoading = false;
    },
    getEventsRequestFailure: (state, action) => {
      state.eventRequests = [];
      state.isLoading = false;
    },
    addEventSuccess: (state, action) => {
      state.isLoading = false;
    },
    addEventFailure: (state, action) => {
      state.isLoading = false;
    },
    addEventParticipantSuccess: (state, action) => {
      state.isLoading = false;
    },
    addEventParticipantFailure: (state, action) => {
      state.isLoading = false;
    },
    getEventSuccess: (state, action) => {
      state.event = action.payload;
      state.isLoading = false;
    },
    getEventFailure: (state, action) => {
      state.event = null;
      state.isLoading = false;
    },
    updateEventsuccess: (state, action) => {
      state.isLoading = false;
    },
    updateEventFailure: (state, action) => {
      state.isLoading = false;
    },
    approveEventsuccess: (state, action) => {
      state.isLoading = false;
    },
    approveEventFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteEventsuccess: (state, action) => {
      const eventId = action.payload.id;
      state.events = state.events.filter((event) => event.id !== eventId);
      state.isLoading = false;
    },
    deleteEventFailure: (state, action) => {
      state.isLoading = false;
    },
    getPaginatedEventsSuccess: (state, action) => {
      state.clientAllEvents = action.payload.eventsWithImageUrl;
      state.hasMore = action.payload.hasMore;
      state.isLoading = false;
    },
    getPaginatedEventsFailure: (state, action) => {
      state.clientAllEvents = [];
      state.isLoading = false;
    },
    getEventByTitleSuccess: (state, action) => {
      state.event = action.payload.data;
      state.isLoading = false;
    },
    getEventByTitleFailure: (state, action) => {
      state.isLoading = false;
    },
    deleteEventParticipantSuccess: (state, action) => {
      const id = action.payload.id;
      state.eventParticipants = state.eventParticipants.filter((event) => event.id !== id);
      state.isLoading = false;
    },
    deleteEventParticipantFailure: (state, action) => {
      state.isLoading = false;
    },
    getEventParticipantSuccess: (state, action) => {
      state.eventParticipant = action.payload.data;
      state.isLoading = false;
    },
    getEventParticipantFailure: (state, action) => {
      state.eventParticipant = null;
      state.isLoading = false;
    },
    updateEventParticipantSuccess: (state, action) => {
      state.isLoading = false;
    },
    updateEventParticipantFailure: (state, action) => {
      state.isLoading = false;
    },
    getECertificatesSuccess: (state, action) => {
      state.userCertificates = action.payload.data.data;
      state.isLoading = false;
    },
    getECertificatesFailure: (state, action) => {
      state.isLoading = false;
    },
    attendedEventSuccess: (state, action) => {
      state.isLoading = false;
    },
    attendedEventFailure: (state, action) => {
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
  },
});

export const getAllEvents =
  (searchTerm, page, pageSize) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-events`, {
        params: {
          searchTerm,
          page,
          pageSize,
        },
      });
      if (response.status === 200) {
        dispatch(getEventsSuccess(response.data));
      } else {
        dispatch(getEventsFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(getEventsFailure());
    }
  };

export const getAllEventParticipants =
  (searchTerm, page, pageSize, selectedEvent) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-all/Eventparticipants`, {
        params: {
          searchTerm,
          page,
          pageSize,
          selectedEvent,
        },
      });
      if (response.status === 200) {
        dispatch(getEventParticipantsSuccess(response.data));
      } else {
        dispatch(getEventParticipantsFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(getEventsFailure());
    }
  };

export const getAllEventParticipantsnopagination =
  () => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-all/Eventparticipantswithoutpagination`);
      if (response.status === 200) {
        dispatch(getEventParticipantsWithoutPaginationSuccess(response.data));
      } else {
        dispatch(getEventParticipantsWithoutPaginationFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(getEventParticipantsWithoutPaginationFailure());
    }
  };

export const getAllRequestEvents =
  (searchTerm, page, pageSize) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-RequestEvents`, {
        params: {
          searchTerm,
          page,
          pageSize,
        },
      });
      if (response.status === 200) {
        dispatch(getEventsRequestSuccess(response.data));
      } else {
        dispatch(getEventsRequestFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(getEventsRequestFailure());
    }
  };

export const approveEvent = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/approveEvent/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) {
      dispatch(approveEventsuccess());
      toast.success(response.data.message);
      var searchTerm = "";
      dispatch(getAllRequestEvents(searchTerm, 1, 10))
    }
  } catch (error) {
    dispatch(approveEventFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const userEvents = (searchTerm, page, pageSize, userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/User-event/${userId}`, {
      params: {
        searchTerm,
        page,
        pageSize,
      },
    });
    if (response.status === 200) {
      dispatch(getUserEventsSuccess(response.data));
    }
  } catch (error) {
    dispatch(getUserEventsFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const addEvent = (data,
  router,
  reset
) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-event`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      reset();
      dispatch(addEventSuccess(data));
      const userInfo = getUserInfoFromToken();
      toast.success("Event Added successfully");
      if (userInfo.roleName.includes(ROLES.Admin)) {
        router.push("/admin/all-events");
      }
      else if (userInfo.roleName.includes(ROLES.Volunteer)) {
        router.push("/user/events");
      }
    }
  } catch (error) {
    dispatch(addEventFailure());
    const errorMessage = error?.response?.data?.error || error.message;
    toast.error(errorMessage);
  }
};


export const addEventParticipant = (data, reset) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-eventParticipant`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      reset();
      dispatch(addEventParticipantSuccess(data));
      toast.success(response.data.message);
    }
    else {
      dispatch(addEventParticipantFailure())
      toast.error(response.data.message);
    }
  } catch (error) {
    dispatch(addEventParticipantFailure());
    const errorMessage = error?.response?.data?.message
    toast.error(errorMessage);
  }
};


export const getEvent = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/event/${id}`);
    if (response.status === 200) {
      dispatch(getEventSuccess(response.data));
    }
    else {
      toast.error("Something went wrong");
      dispatch(getEventFailure());
    }
  } catch (error) {
    toast.error(error.message);
    dispatch(getEventFailure());
  }
};

export const getEventByTitle = (title) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/get-event`, { title }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      dispatch(getEventByTitleSuccess(response.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getEventByTitleFailure());
    }
  } catch (error) {
    toast.error(error.message);
    dispatch(getEventByTitleFailure());
  }
};

export const updateEvent = (id, data, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/update-event/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) {
      var userInfo = getUserInfoFromToken();
      if (userInfo !== null && userInfo.roleName?.includes(ROLES.Admin)) {
        navigate(`/admin/all-events`);
      }
      dispatch(updateEventsuccess());
      toast.success(response.data.message);
    }
  } catch (error) {
    dispatch(updateEventFailure(error));
    const errorMessage = error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-event/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      var searchTerm = "";
      dispatch(deleteEventsuccess({ id }));
      toast.success(response.data.message);
      dispatch(getAllEvents(searchTerm, 1, 10));
    }
  } catch (error) {
    dispatch(deleteEventFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const getPaginatedEvents = (page, pageSize) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-paginated-events`, {
      params: {
        page,
        pageSize,
      },
    });
    if (response.data.success) {
      dispatch(getPaginatedEventsSuccess(response.data.data));
    } else {
      dispatch(getPaginatedEventsFailure());
    }
  } catch (error) {
    console.log(error);
    dispatch(getPaginatedEventsFailure());
  }
};

export const getALLEvents = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-Allevents`, {
    });
    if (response.data.success) {
      dispatch(getALLEventsSuccess(response.data));
    } else {
      dispatch(getALLEventsFailure());
    }
  } catch (error) {
    console.log(error);
    dispatch(getPaginatedEventsFailure());
  }
};

export const UpdateEventParticipantbyId = (id, data, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/update/Eventparticipant/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      var userInfo = getUserInfoFromToken();
      if (userInfo !== null && userInfo.roleName?.includes(ROLES.Admin)) {
        router.push(`/admin/event/allParticipantslist`);
      }
      dispatch(updateEventParticipantSuccess());
      toast.success(response.data.message);
    } else {
      dispatch(updateEventParticipantFailure());
    }
  } catch (error) {
    console.log(error);
    dispatch(updateEventParticipantFailure());
  }
};

export const deleteEventParticipant = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/delete-eventParticipant/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      var searchTerm = "";
      dispatch(deleteEventParticipantSuccess({ id }));
      toast.success(response.data.message);
      dispatch(getAllEventParticipants(searchTerm, 1, 10));
    }
  } catch (error) {
    dispatch(deleteEventParticipantFailure(error));
    const errorMessage =
      error?.response?.data?.error || "Internal Server Error";
    toast.error(errorMessage);
  }
};

export const getEventParticipant = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get/Eventparticipant/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      dispatch(getEventParticipantSuccess(response.data));
    }
    else {
      toast.error(response.data.message);
      dispatch(getEventParticipantFailure());
    }
  } catch (error) {
    toast.error(error.message);
    dispatch(getEventParticipantFailure());
  }
};

export const getECertificates = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/get/e-certificates`, email);
    dispatch(getECertificatesSuccess(response));
  } catch (error) {
    debugger
    toast.error(error.message);

  }
};

export const attendedEvent = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attendedEvent`, data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(attendedEventSuccess());
      dispatch(getAllEventParticipants(commonPaginatedState.search, commonPaginatedState.page, commonPaginatedState.pagesize));
      toast.success(response.data.message);
    }
    else {
      dispatch(attendedEventFailure());
      toast.error(response.data.message);
    }
  }
  catch (error) {
    dispatch(attendedEventFailure());
    toast.success(error.message);
  }
}

export const {
  getEventsSuccess,
  getEventsFailure,
  getALLEventsSuccess,
  getALLEventsFailure,
  attendedEventSuccess,
  attendedEventFailure,
  getEventParticipantsSuccess,
  getEventParticipantsFailure,
  getEventParticipantsWithoutPaginationSuccess,
  getEventParticipantsWithoutPaginationFailure,
  getEventParticipantSuccess,
  getEventParticipantFailure,
  getUserEventsSuccess,
  getUserEventsFailure,
  getEventsRequestSuccess,
  getEventsRequestFailure,
  addEventSuccess,
  addEventFailure,
  addEventParticipantSuccess,
  addEventParticipantFailure,
  getEventSuccess,
  getEventFailure,
  updateEventParticipantSuccess,
  updateEventParticipantFailure,
  updateEventsuccess,
  updateEventFailure,
  approveEventsuccess,
  approveEventFailure,
  deleteEventsuccess,
  deleteEventFailure,
  deleteEventParticipantSuccess,
  deleteEventParticipantFailure,
  getPaginatedEventsSuccess,
  getPaginatedEventsFailure,
  getEventByTitleSuccess,
  getEventByTitleFailure,
  getECertificatesSuccess,
  getECertificatesFailure,
  setLoading,
} = eventslice.actions;
export default eventslice.reducer;
