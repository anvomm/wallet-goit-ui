import {
  register,
  login,
  logout,
  current,
  refresh,
  verifyUser,
} from "./auth-operations";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  token: "",
  isLoading: false,
  error: null,
  isAuth: false,
  isRefreshing: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) =>
    builder
      .addCase(register.fulfilled, (state, { payload }) => {
        state.user = payload.data;
      })

      .addCase(verifyUser.fulfilled, (state, action) => {
        console.log("payload", action)
        state.user = action.payload.data;
        state.token = action.payload.data.token;
        state.isAuth = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
        state.isAuth = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = "";
        state.user = {};
        state.isAuth = false;
      })
      .addCase(refresh.fulfilled, (state, { payload }) => {
        state.isAuth = true;
        state.token = payload.token;
      })

      .addCase(current.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(current.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.error = null;
        state.isRefreshing = false;
      })

      .addCase(current.rejected, (state) => {
        state.isRefreshing = false;
      })

      .addMatcher(
        isAnyOf(
          register.fulfilled,
          login.fulfilled,
          logout.fulfilled,
          refresh.fulfilled,
          verifyUser.fulfilled
        ),
        (state) => {
          state.isLoading = false;
        }
      )

      .addMatcher(
        isAnyOf(
          register.pending,
          login.pending,
          logout.pending,
          refresh.pending,
          verifyUser.pending,
          current.pending
        ),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          register.rejected,
          login.rejected,
          logout.rejected,
          refresh.rejected,
          verifyUser.rejected,
          current.rejected
        ),
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload;
        }
      ),
});

export default authSlice.reducer;
