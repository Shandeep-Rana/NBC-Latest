import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const heroSlice = createSlice({
    name: "hero",
    initialState: {
        allHeroes: [],
        heroesCount: null,
        heroDetails: null,
        isLoading: false,
        hasMoreHeroes: false,
    },
    reducers: {
        getPaginatedHeroesSuccess: (state, action) => {
            state.allHeroes = action.payload.data.heroes;
            state.heroesCount = action.payload.data.pagination.total;
            state.hasMoreHeroes = action.payload.data.pagination.hasMore;
            state.isLoading = false;
        },
        getPaginatedHeroesFailure: (state, action) => {
            state.allHeroes = [];
            state.heroesCount = null;
            state.isLoading = false;
        },
        addHeroSuccess: (state, action) => {
            state.allHeroes.push(action.payload.insertedHero);
            state.heroesCount = state.heroesCount + 1
            state.isLoading = false;
        },
        addHeroFailure: (state, action) => {
            state.isLoading = false;
        },
        getHeroDetailSuccess: (state, action) => {
            state.heroDetails = action.payload.data;
            state.isLoading = false;
        },
        getHeroDetailFailure: (state, action) => {
            state.heroDetails = null;
            state.isLoading = false;
        },
        updateHeroSuccess: (state, action) => {
            state.isLoading = false;
        },
        updateHeroFailure: (state, action) => {
            state.isLoading = false;
        },
        deleteHeroSuccess: (state, action) => {
            const id = action.payload;
            state.allHeroes = state.allHeroes.filter((hero) => hero.hero_id !== id);
            state.heroesCount = state.heroesCount - 1;
            state.isLoading = false;
        },
        deleteHeroFailure: (state, action) => {
            state.isLoading = false;
        },
        setLoading: (state, action) => {
            state.isLoading = true;
        },
    },
});

export const getPaginatedHeroes = (search, page, pageSize) => async (dispatch) => {
    try {
        dispatch(setLoading());
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/heroes`, {
            params: {
                page,
                pageSize,
                search
            },
        });
        if (response.data.success) {
            dispatch(getPaginatedHeroesSuccess(response.data));
        } else {
            dispatch(getPaginatedHeroesFailure());
            toast.error(response.data.message);
        }
    } catch (error) {
        dispatch(getPaginatedHeroesFailure());
        toast.error(error.message);
    }
};

export const addHero = (data, userId, navigate, reset, setPhotoUrl) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-hero`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "user-id": userId,
            },
        });
        if (response.data.success) {
            reset();
            setPhotoUrl('');
            toast.success(response.data.message);
            dispatch(addHeroSuccess(response.data.data));
            navigate("/admin/heroes");
        }
        else {
            toast.error(response.data.message);
            dispatch(addHeroFailure());
        }
    } catch (error) {
        dispatch(addHeroFailure());
        const errorMessage =
            error?.response?.data?.error || "Internal Server Error";
        toast.error(errorMessage);
    }
};

export const getHeroDetail = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hero-detail/${id}`);
        if (response.data.success)
            dispatch(getHeroDetailSuccess(response.data));

        else {
            toast.error(response.data.message);
            dispatch(getHeroDetailFailure());
        }
    } catch (error) {
        dispatch(getHeroDetailFailure());
        const errorMessage = error?.response?.data?.error || "Internal Server Error";
        toast.error(errorMessage);
    }
};

export const updateHero = (id, userId, data, navigate, reset, setPhotoUrl) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/update-hero/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "user-id": userId,
            },
        });
        if (response.data.success) {
            reset();
            setPhotoUrl('');
            toast.success(response.data.message);
            dispatch(updateHeroSuccess(response.data.data));
            navigate("/admin/heroes");
        }
        else {
            toast.error(response.data.message);
            dispatch(updateHeroFailure());
        }
    } catch (error) {
        dispatch(updateHeroFailure());
        const errorMessage =
            error?.response?.data?.error || "Internal Server Error";
        toast.error(errorMessage);
    }
};

export const deleteHero = (id, userId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/delete-hero/${id}`, {
            headers: {
                "Content-Type": "multipart/form-data",
                "user-id": userId,
            },
        });
        if (response.data.success) {
            toast.success(response.data.message);
            dispatch(deleteHeroSuccess(id));
        }
        else {
            toast.error(response.data.message);
            dispatch(deleteHeroFailure());
        }
    } catch (error) {
        dispatch(deleteHeroFailure());
        const errorMessage =
            error?.response?.data?.error || "Internal Server Error";
        toast.error(errorMessage);
    }
};

export const {
    setLoading,
    getPaginatedHeroesSuccess,
    getPaginatedHeroesFailure,
    addHeroSuccess,
    addHeroFailure,
    getHeroDetailSuccess,
    getHeroDetailFailure,
    updateHeroSuccess,
    updateHeroFailure,
    deleteHeroSuccess,
    deleteHeroFailure,
} = heroSlice.actions;

export default heroSlice.reducer;