import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store/store";
import { ProviderType } from "@/types/provider";

interface UserState {
  id: string | null;
  fullName: string | null;
  email: string | null;
  role: string | null;
  providerType: ProviderType | null
  accessToken: string | null,
  xenditKey: string | null,
  semaphoreKey: string | null,
}

const initialState: UserState = {
  id: null,
  fullName: null,
  email: null,
  role: null,
  providerType: null,
  accessToken: null,
  xenditKey: null,
  semaphoreKey: null
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.providerType = action.payload.providerType;
      state.accessToken = action.payload.accessToken;
      state.xenditKey = null;
      state.semaphoreKey = null;
    },
    updateUserField: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
    logout: (state) => {
      state.id = null;
      state.fullName = null;
      state.email = null;
      state.role = null;
      state.providerType = null;
      state.accessToken = null;
      state.xenditKey = null;
      state.semaphoreKey = null;
    },
    updateToken: (state, action) => {
        const {accessToken} = action.payload
        state.accessToken = accessToken
    },
    setXenditKey: (state, action: PayloadAction<{xenditKey: string}>) => {
      console.log(action.payload.xenditKey)
      state.xenditKey = action.payload.xenditKey
    },
    setSemaphoreKey: (state, action: PayloadAction<{semaphoreKey: string}>) => {
      console.log(action.payload.semaphoreKey)
      state.semaphoreKey = action.payload.semaphoreKey
    }
  },
});

export const { setUser, updateUserField, logout, updateToken, setXenditKey, setSemaphoreKey} = userSlice.actions;
export const getCurrentToken = (state: RootState) => state.auth.accessToken
export default userSlice.reducer;

