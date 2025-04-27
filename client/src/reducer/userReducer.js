// client/src/reducer/userReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetAllUsers } from "../apis/user/user";

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetAllUsers();
      console.log("API response:", response.data); // Debug API response
      return response.data;
    } catch (error) {
      console.log("API error:", error.response?.data); // Debug API error
      return rejectWithValue(error.response?.data?.mess || "Failed to fetch users");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userAll: [], // Khởi tạo là mảng rỗng
    loadingUserAll: false,
    errorUserAll: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loadingUserAll = true;
        state.errorUserAll = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loadingUserAll = false;
        state.userAll = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loadingUserAll = false;
        state.errorUserAll = action.payload;
      });
  },
});

export default userSlice.reducer;