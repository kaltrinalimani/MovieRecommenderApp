import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {
      uid: null,
      displayName: null,
      email: null,
      favoriteMedia: [], // Add favoriteMedia array to store liked movies
    },
    isLoading: true,
  },
  reducers: {
    logInUser: (state, action) => {
      state.userData = { ...action.payload.userData };
    },
    logOutUser: (state) => {
      state.userData = {
        uid: null,
        displayName: null,
        email: null,
        favoriteMedia: [], // Reset favoriteMedia on logout
      };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setFavoriteMedia: (state, action) => {
      state.userData.favoriteMedia = action.payload;
    },
    addFavorite: (state, action) => {
      if (!state.userData.favoriteMedia) {
        state.userData.favoriteMedia = [];
      }
      state.userData.favoriteMedia.push(action.payload);
    },
    removeFavorite: (state, action) => {
      if (state.userData.favoriteMedia) {
        state.userData.favoriteMedia = state.userData.favoriteMedia.filter(
          (media) => media.id !== action.payload.id
        );
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  logInUser,
  logOutUser,
  setLoading,
  setFavoriteMedia,
  addFavorite,
  removeFavorite,
} = userSlice.actions;

export default userSlice.reducer;
