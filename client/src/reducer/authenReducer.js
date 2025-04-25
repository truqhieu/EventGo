import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { apiGetCurrent } from "../apis/authen/authentication";

export const fetchCurrentData = createAsyncThunk("fetchCurrent", async (_) => {
  const response = await apiGetCurrent();
  return response;
});

const authenReducer = createSlice({
  name: "fetchCurrent",
  initialState: {
    user: null,
    errorUser: null,
    isLoadingUser: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentData.pending, (state) => {
        state.isLoadingUser = true;
      })

      .addCase(fetchCurrentData.fulfilled, (state, action) => {
        state.isLoadingUser = false;
        state.user = action.payload.mess;
      })
      .addCase(fetchCurrentData.rejected, (state, action) => {
        state.isLoadingUser = false;
        state.errorUser = action.error.message;
      });
  },
});
export default authenReducer;
