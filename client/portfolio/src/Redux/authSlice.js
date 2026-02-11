import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "./UserApi"; // استيراد الـ API
const initialState = {
  isAuthenticated: false,
  user: null,
  isLoadingAuth: true,
  error: null, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoadingAuth = false;
    },
    clearAuthUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoadingAuth = false;
    },
    setLoadingAuth: (state, action) => {
      state.isLoadingAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ================== get user data ================
    // ⏳ لما يبدأ الطلب (قبل ما يخلص)
    builder.addMatcher(
      userApi.endpoints.getUserByName.matchPending,
      (state) => {
        state.isLoadingAuth = true;
        state.error = null; // بنصفر أي خطأ قديم
      },
    );
    // ✅ لو الطلب نجح
    builder.addMatcher(
      userApi.endpoints.getUserByName.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoadingAuth = false;
        state.error = null; // نبدأ من غير خطأ
      },
    );
    // ❌ لو الطلب فشل
    builder.addMatcher(
      userApi.endpoints.getUserByName.matchRejected,
      (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoadingAuth = false;
        // @ts-ignore
        state.error = action.error?.data?.message || "حدث خطأ أثناء جلب البيانات";
      },
    );
    //signin
    builder.addMatcher(
      userApi.endpoints.signin.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoadingAuth = false;
      },
    )
      //logout
      .addMatcher(userApi.endpoints.signOut.matchFulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });

  },
});

export const { setAuthUser, clearAuthUser, setLoadingAuth } = authSlice.actions;
export default authSlice.reducer;