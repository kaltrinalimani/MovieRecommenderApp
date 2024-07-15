import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
  name: "home",
  initialState: {
    url: {},
    genres: {},
    combinedMedias: [],
    allDataLoading: false,
  },
  reducers: {
    getApiConfiguration: (state, action) => {
      state.url = action.payload;
    },
    getGenres: (state, action) => {
      state.genres = action.payload;
    },
    setCombinedMedias: (state, action) => {
      state.combinedMedias = action.payload;
    },
    setAllDataLoading: (state, action) => {
      state.allDataLoading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getApiConfiguration,
  getGenres,
  setCombinedMedias,
  setAllDataLoading,
} = homeSlice.actions;

export default homeSlice.reducer;
